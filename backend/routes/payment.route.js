import express from "express";
import { checkoutSuccess, createCheckoutSession, createCodOrder } from "../controllers/payment.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.post("/checkout-success", checkoutSuccess);
router.post("/create-cod-order", protectRoute, createCodOrder);

export default router;
