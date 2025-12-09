import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAdminRoute } from "../middleware/admin.middleware.js";
import { getMyOrders, getAllOrders, updateOrderStatus } from "../controllers/order.controller.js";

const router = express.Router();

// User routes
router.get("/my-orders", protectRoute, getMyOrders);

// Admin routes
router.get("/all-orders", protectRoute, getAdminRoute, getAllOrders);
router.patch("/:orderId/status", protectRoute, getAdminRoute, updateOrderStatus);

export default router;
