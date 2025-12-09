import express from "express";
import { getFavorites, addToFavorites, removeFromFavorites } from "../controllers/favorite.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getFavorites);
router.post("/", protectRoute, addToFavorites);
router.delete("/", protectRoute, removeFromFavorites);

export default router;
