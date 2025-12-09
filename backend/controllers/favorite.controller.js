import Favorite from "../models/favorite.model.js";

export const getFavorites = async (req, res) => {
	try {
		const favorites = await Favorite.findOne({ userId: req.user._id }).populate("products");

		if (!favorites) {
			return res.status(200).json([]);
		}

		res.status(200).json(favorites.products);
	} catch (error) {
		console.error("Error fetching favorites:", error);
		res.status(500).json({ message: "Error fetching favorites", error: error.message });
	}
};

export const addToFavorites = async (req, res) => {
	try {
		const { productId } = req.body;

		if (!productId) {
			return res.status(400).json({ message: "Product ID is required" });
		}

		let favorites = await Favorite.findOne({ userId: req.user._id });

		if (!favorites) {
			favorites = new Favorite({
				userId: req.user._id,
				products: [productId],
			});
		} else {
			if (!favorites.products.includes(productId)) {
				favorites.products.push(productId);
			}
		}

		await favorites.save();
		res.status(200).json({ message: "Product added to favorites" });
	} catch (error) {
		console.error("Error adding to favorites:", error);
		res.status(500).json({ message: "Error adding to favorites", error: error.message });
	}
};

export const removeFromFavorites = async (req, res) => {
	try {
		const { productId } = req.body;

		if (!productId) {
			return res.status(400).json({ message: "Product ID is required" });
		}

		const favorites = await Favorite.findOne({ userId: req.user._id });

		if (!favorites) {
			return res.status(404).json({ message: "Favorites not found" });
		}

		favorites.products = favorites.products.filter((id) => id.toString() !== productId);
		await favorites.save();

		res.status(200).json({ message: "Product removed from favorites" });
	} catch (error) {
		console.error("Error removing from favorites:", error);
		res.status(500).json({ message: "Error removing from favorites", error: error.message });
	}
};
