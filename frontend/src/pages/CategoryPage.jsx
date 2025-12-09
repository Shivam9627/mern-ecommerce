import { useEffect, useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useFavoritesStore } from "../stores/useFavoritesStore";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
	const { fetchProductsByCategory, products } = useProductStore();
	const { fetchFavorites, favorites } = useFavoritesStore();
	const { category } = useParams();
	const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

	useEffect(() => {
		fetchProductsByCategory(category);
		fetchFavorites();
	}, [fetchProductsByCategory, category, fetchFavorites]);

	const displayedProducts = showFavoritesOnly
		? products?.filter((p) => favorites.some((fav) => fav._id === p._id))
		: products;

	return (
		<div className='min-h-screen'>
			<div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<motion.h1
					className='text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-12'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					{category.charAt(0).toUpperCase() + category.slice(1)}
				</motion.h1>

				<motion.div
					className='space-y-6'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					{/* Filter Button - Inside content area */}
					<div className='flex justify-center mb-8'>
						<button
							onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
							className={`px-6 py-2 rounded-lg font-semibold transition ${
								showFavoritesOnly
									? "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/50"
									: "bg-gray-700 text-gray-300 hover:bg-gray-600"
							}`}
						>
							{showFavoritesOnly ? "❤️ My Favorites" : "★ All Products"}
						</button>
					</div>

					{/* Products Grid */}
					<motion.div
						className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.8, delay: 0.2 }}
					>
						{displayedProducts?.length === 0 && (
							<h2 className='text-3xl font-semibold text-gray-300 text-center col-span-full'>
								{showFavoritesOnly ? "No favorite products yet" : "No products found"}
							</h2>
						)}

						{displayedProducts?.map((product) => (
							<ProductCard key={product._id} product={product} />
						))}
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
};
export default CategoryPage;
