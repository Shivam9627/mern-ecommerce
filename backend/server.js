import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import orderRoutes from "./routes/order.route.js";
import favoriteRoutes from "./routes/favorite.route.js";

import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Your frontend domain for production
// Example: https://myshop.vercel.app
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Allow CORS for frontend
app.use(
	cors({
		origin: CLIENT_URL,
		credentials: true, // allow cookies
	})
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/favorites", favoriteRoutes);

// ❌ REMOVE FRONTEND SERVING
// Because frontend is hosted separately on Vercel, NOT in backend
// So no need for express.static()

// Start the server
app.listen(PORT, () => {
	console.log(`Backend server running on PORT ${PORT}`);
	connectDB();
});
