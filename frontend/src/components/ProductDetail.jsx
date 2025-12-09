import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Plus, Minus, Heart } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { useFavoritesStore } from "../stores/useFavoritesStore";
import toast from "react-hot-toast";

const ProductDetail = ({ product, onClose, onFavoriteChange }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const { addToCart } = useCartStore();
  const { isFavorite, addToFavorites, removeFromFavorites, fetchFavorites } = useFavoritesStore();
  const [isFav, setIsFav] = useState(false);

  const clothingCategories = ["men", "women", "kids", "shoes"];
  const isClothing = product.category && clothingCategories.some(cat => product.category.toLowerCase().includes(cat));

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    setIsFav(isFavorite(product._id));
  }, [product._id, isFavorite]);

  const handleAddToCart = async () => {
    if (isClothing && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    const cartItem = {
      ...product,
      quantity,
      size: selectedSize || undefined,
    };

    await addToCart(cartItem);
    onClose();
  };

  const handleToggleFavorite = async () => {
    if (isFav) {
      await removeFromFavorites(product._id);
      setIsFav(false);
      toast.success("Removed from favorites");
    } else {
      await addToFavorites(product);
      setIsFav(true);
      toast.success("Added to favorites");
    }
    // Notify parent component about favorite change
    if (onFavoriteChange) {
      onFavoriteChange(product._id, !isFav);
    }
  };

  const handleQuantityChange = (value) => {
    if (value > 0) {
      setQuantity(value);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{product.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={28} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="flex items-center justify-center">
              <div className="w-full bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400?text=Product+Image";
                  }}
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Price and Rating */}
              <div>
                <p className="text-3xl font-bold text-emerald-400">${product.price}</p>
                {product.rating && (
                  <p className="text-sm text-gray-400 mt-1">⭐ {product.rating.toFixed(1)} rating</p>
                )}
              </div>

              {/* Category and Stock */}
              <div>
                <p className="text-gray-400">
                  <span className="font-semibold text-gray-300">Category:</span> {product.category || "N/A"}
                </p>
                <p className={`text-sm font-semibold mt-1 ${product.stock > 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {product.stock && product.stock > 0 ? `${product.stock} In Stock` : "Out of stock"}
                </p>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                <p className="text-gray-300 leading-relaxed">
                  {product.description || "No description available for this product."}
                </p>
              </div>

              {/* Size Selection (for clothing) */}
              {isClothing && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Select Size</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 px-4 rounded-md font-semibold transition ${
                          selectedSize === size
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Quantity</h3>
                <div className="flex items-center gap-4 bg-gray-700 px-4 py-2 rounded-lg w-fit">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="text-white font-bold text-lg min-w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <motion.button
                  onClick={handleAddToCart}
                  disabled={!product.stock || product.stock === 0}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {!product.stock || product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </motion.button>

                <button
                  onClick={handleToggleFavorite}
                  className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-lg transition ${
                    isFav
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  }`}
                >
                  <Heart size={20} fill={isFav ? "currentColor" : "none"} />
                  {isFav ? "Added to Favorites" : "Add to Favorites"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductDetail;
