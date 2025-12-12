import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { Link, useNavigate } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || "";
const stripePromise = STRIPE_PUBLIC_KEY ? loadStripe(STRIPE_PUBLIC_KEY) : null;

const OrderSummary = ({ shippingAddress }) => {
	const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();
	const { user } = useUserStore();
	const navigate = useNavigate();

	const savings = subtotal - total;
	const formattedSubtotal = subtotal.toFixed(2);
	const formattedTotal = total.toFixed(2);
	const formattedSavings = savings.toFixed(2);

	const handlePayment = async () => {
		if (!user) {
			toast.error("Please login first before checking out");
			navigate("/login");
			return;
		}

		if (!shippingAddress) {
			toast.error("Please add a shipping address before checkout");
			return;
		}

		if (!STRIPE_PUBLIC_KEY) {
			console.error("Missing Stripe publishable key. Set VITE_STRIPE_PUBLIC_KEY in .env");
			toast.error("Payment system not configured");
			return;
		}

		try {
			const stripe = await stripePromise;
			if (!stripe) {
				console.error("Failed to initialize Stripe");
				toast.error("Failed to initialize payment system");
				return;
			}

			const res = await axios.post("/payments/create-checkout-session", {
				products: cart,
				couponCode: coupon ? coupon.code : null,
				shippingAddress,
			});

			if (!res || !res.data || !res.data.url) {
				console.error("Invalid checkout session response", res);
				toast.error("Failed to create checkout session");
				return;
			}

			// Redirect to Stripe checkout URL
			window.location.href = res.data.url;
		} catch (err) {
			console.error("Checkout error:", err.response?.data || err.message);
			const errorMsg = err.response?.data?.error || err.response?.data?.message || "Payment failed";
			toast.error(errorMsg);
		}
	};

	const handleCodOrder = async () => {
		if (!user) {
			toast.error("Please login first before checking out");
			navigate("/login");
			return;
		}

		if (!shippingAddress) {
			toast.error("Please add a shipping address before checkout");
			return;
		}

		try {
			const res = await axios.post("/payments/create-cod-order", {
				products: cart,
				couponCode: coupon ? coupon.code : null,
				shippingAddress,
			});

			if (!res || !res.data || !res.data.success) {
				toast.error("Failed to place COD order");
				return;
			}

			navigate("/purchase-success?cod=true");
		} catch (err) {
			console.error("COD checkout error:", err.response?.data || err.message);
			const errorMsg = err.response?.data?.error || err.response?.data?.message || "COD order failed";
			toast.error(errorMsg);
		}
	};

	return (
		<motion.div
			className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<p className='text-xl font-semibold text-emerald-400'>Order summary</p>

			<div className='space-y-4'>
				<div className='space-y-2'>
					<dl className='flex items-center justify-between gap-4'>
						<dt className='text-base font-normal text-gray-300'>Original price</dt>
						<dd className='text-base font-medium text-white'>${formattedSubtotal}</dd>
					</dl>

					{savings > 0 && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Savings</dt>
							<dd className='text-base font-medium text-emerald-400'>-${formattedSavings}</dd>
						</dl>
					)}

					{coupon && isCouponApplied && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Coupon ({coupon.code})</dt>
							<dd className='text-base font-medium text-emerald-400'>-{coupon.discountPercentage}%</dd>
						</dl>
					)}
					<dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
						<dt className='text-base font-bold text-white'>Total</dt>
						<dd className='text-base font-bold text-emerald-400'>${formattedTotal}</dd>
					</dl>
				</div>

			<motion.button
				className={`flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-4 ${
					user && shippingAddress
						? "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-300"
						: "bg-gray-600 cursor-not-allowed"
				}`}
				whileHover={user && shippingAddress ? { scale: 1.05 } : {}}
				whileTap={user && shippingAddress ? { scale: 0.95 } : {}}
				onClick={handlePayment}
				disabled={!user || !shippingAddress}
			>
				{!user ? "Login to Checkout" : !shippingAddress ? "Add Address to Checkout" : "Proceed to Checkout"}
			</motion.button>

			<motion.button
				className={`mt-2 flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-4 ${
					user && shippingAddress
						? "bg-gray-700 hover:bg-gray-600 focus:ring-gray-500"
						: "bg-gray-600 cursor-not-allowed"
				}`}
				whileHover={user && shippingAddress ? { scale: 1.05 } : {}}
				whileTap={user && shippingAddress ? { scale: 0.95 } : {}}
				onClick={handleCodOrder}
				disabled={!user || !shippingAddress}
			>
				Cash on Delivery
			</motion.button>

				<div className='flex items-center justify-center gap-2'>
					<span className='text-sm font-normal text-gray-400'>or</span>
					<Link
						to='/'
						className='inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline'
					>
						Continue Shopping
						<MoveRight size={16} />
					</Link>
				</div>
			</div>
		</motion.div>
	);
};
export default OrderSummary;
