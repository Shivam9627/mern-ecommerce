import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

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

// ---------------------------------------------------------------------------
// Allowed frontend domains
// ---------------------------------------------------------------------------
const allowedOrigins = [
    "http://localhost:5173",
    "https://mern-ecommerce-frontend-gg0c7lu19-shivam-chamolis-projects.vercel.app",
    "https://mern-ecommerce-frontend-six-psi.vercel.app",
    "https://mern-ecommerce-frontend-3l43kzc73-shivam-chamolis-projects.vercel.app",
    process.env.CLIENT_URL
];


app.use(
    cors({
        origin: function (origin, callback) {
            // allow REST tools + same-origin
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("❌ Not allowed by CORS: " + origin));
            }
        },
        credentials: true,
    })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/favorites", favoriteRoutes);


app.listen(PORT, () => {
    console.log(`Backend running on PORT ${PORT}`);
    connectDB();
});
