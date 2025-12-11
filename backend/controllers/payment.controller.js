import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { stripe } from "../lib/stripe.js";

// ---------------- CREATE CHECKOUT SESSION ----------------
export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode, shippingAddress, userId } = req.body;

		if (!userId) {
			return res.status(400).json({ error: "User ID missing" });
		}

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0;

		const lineItems = products.map((product) => {
			const amount = Math.round(product.price * 100);
			totalAmount += amount * product.quantity;

			return {
				price_data: {
					currency: "usd",
					product_data: {
						name: product.name,
						images: [product.image],
					},
					unit_amount: amount,
				},
				quantity: product.quantity || 1,
			};
		});

		let coupon = null;
		if (couponCode) {
			coupon = await Coupon.findOne({ code: couponCode, userId, isActive: true });

			if (coupon) {
				totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
			}
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",

			// Correct Redirect URLs
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,

			discounts: coupon
				? [
						{
							coupon: await createStripeCoupon(coupon.discountPercentage),
						},
				  ]
				: [],

			metadata: {
				userId,
				couponCode: couponCode || "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
					}))
				),
				shippingAddress: JSON.stringify(shippingAddress || {}),
			},
		});

		console.log("Stripe session created:", session.id);

		if (totalAmount >= 20000) {
			await createNewCoupon(userId);
		}

		// IMPORTANT: return checkout URL
		return res.status(200).json({ url: session.url });

	} catch (error) {
		console.error("Error creating checkout session:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message });
	}
};

// ---------------- CHECKOUT SUCCESS HANDLER ----------------
export const checkoutSuccess = async (req, res) => {
	try {
		const { sessionId } = req.body;

		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status !== "paid") {
			return res.status(400).json({ error: "Payment not completed" });
		}

		// disable used coupon
		if (session.metadata.couponCode) {
			await Coupon.findOneAndUpdate(
				{
					code: session.metadata.couponCode,
					userId: session.metadata.userId,
				},
				{ isActive: false }
			);
		}

		const products = JSON.parse(session.metadata.products);
		const shippingAddress = session.metadata.shippingAddress
			? JSON.parse(session.metadata.shippingAddress)
			: null;

		const newOrder = new Order({
			user: session.metadata.userId,
			products: products.map((product) => ({
				product: product.id,
				quantity: product.quantity,
				price: product.price,
			})),
			totalAmount: session.amount_total / 100,
			stripeSessionId: sessionId,
			shippingAddress,
		});

		await newOrder.save();

		return res.status(200).json({
			success: true,
			message: "Payment successful, order created.",
			orderId: newOrder._id,
		});
	} catch (error) {
		console.error("Error in checkoutSuccess:", error);
		res.status(500).json({ message: "Error processing successful checkout", error: error.message });
	}
};

// ---------------- HELPERS ----------------
async function createStripeCoupon(discountPercentage) {
	const coupon = await stripe.coupons.create({
		percent_off: discountPercentage,
		duration: "once",
	});
	return coupon.id;
}

async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		userId,
	});

	await newCoupon.save();
	return newCoupon;
}
