import Order from "../models/order.model.js";

export const getMyOrders = async (req, res) => {
	try {
		const userId = req.user._id;
		const orders = await Order.find({ user: userId })
			.populate("products.product", "name price image")
			.sort({ createdAt: -1 });

		res.json(orders);
	} catch (error) {
		console.error("Error fetching orders:", error);
		res.status(500).json({ message: "Failed to fetch orders", error: error.message });
	}
};

export const getAllOrders = async (req, res) => {
	try {
		const orders = await Order.find()
			.populate("user", "name email")
			.populate("products.product", "name price image")
			.sort({ createdAt: -1 });

		res.json(orders);
	} catch (error) {
		console.error("Error fetching all orders:", error);
		res.status(500).json({ message: "Failed to fetch orders", error: error.message });
	}
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!["pending", "shipped", "on-the-way", "delivered"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const order = await Order.findById(orderId).populate("products.product", "name price image");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;

        if (status === "delivered" && order.paymentMethod === "cod" && order.paymentStatus !== "paid") {
            order.paymentStatus = "paid";
        }

        await order.save();

        res.json(order);
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Failed to update order", error: error.message });
    }
};
