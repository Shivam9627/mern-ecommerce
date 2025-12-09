import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { useFavoritesStore } from "../stores/useFavoritesStore";
import ProductDetail from "./ProductDetail";
import toast from "react-hot-toast";

const FeaturedProducts = ({ featuredProducts }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(4);
	const [selectedProduct, setSelectedProduct] = useState(null);

	const { addToCart } = useCartStore();
	const { isFavorite, addToFavorites, removeFromFavorites } = useFavoritesStore();
	const [favoritesState, setFavoritesState] = useState({});

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) setItemsPerPage(1);
			else if (window.innerWidth < 1024) setItemsPerPage(2);
			else if (window.innerWidth < 1280) setItemsPerPage(3);
			else setItemsPerPage(4);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		if (featuredProducts) {
			const favorites = {};
			featuredProducts.forEach((product) => {
				favorites[product._id] = isFavorite(product._id);
			});
			setFavoritesState(favorites);
		}
	}, [featuredProducts, isFavorite]);

	const nextSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
	};

	const prevSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
	};

	const handleToggleFavorite = async (e, product) => {
		e.stopPropagation();
		const isFav = favoritesState[product._id];
		if (isFav) {
			await removeFromFavorites(product._id);
			setFavoritesState((prev) => ({ ...prev, [product._id]: false }));
			toast.success("Removed from favorites");
		} else {
			await addToFavorites(product);
			setFavoritesState((prev) => ({ ...prev, [product._id]: true }));
			toast.success("Added to favorites");
		}
	};

	const handleFavoriteChangeFromModal = (productId, isFav) => {
		setFavoritesState((prev) => ({ ...prev, [productId]: isFav }));
	};

	const isStartDisabled = currentIndex === 0;
	const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

	return (
		<div className='py-12'>
			<div className='container mx-auto px-4'>
				<h2 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>Featured</h2>
				<div className='relative'>
					<div className='overflow-hidden'>
						<div
							className='flex transition-transform duration-300 ease-in-out'
							style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
						>
							{featuredProducts?.map((product) => (
								<div key={product._id} className='w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2'>
									<div
										onClick={() => setSelectedProduct(product)}
										className='bg-white bg-opacity-10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl border border-emerald-500/30 cursor-pointer'
									>
										<div className='relative overflow-hidden group'>
											<img
												src={product.image}
												alt={product.name}
												className='w-full h-48 object-cover transition-transform duration-300 ease-in-out group-hover:scale-110'
											/>
											{/* Favorite Button */}
											<button
												onClick={(e) => handleToggleFavorite(e, product)}
												className='absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition z-10'
											>
												<Heart
													size={20}
													className={favoritesState[product._id] ? "fill-red-500 text-red-500" : "text-white"}
												/>
											</button>
										</div>
										<div className='p-4'>
											<h3 className='text-lg font-semibold mb-2 text-white'>{product.name}</h3>
											<p className='text-emerald-300 font-medium mb-2'>
												${product.price.toFixed(2)}
											</p>
											<p className={`text-sm font-semibold mb-4 ${product.stock && product.stock > 0 ? "text-emerald-400" : "text-red-400"}`}>
												{product.stock && product.stock > 0 ? `${product.stock} In Stock` : "Out of stock"}
											</p>
											<button
												onClick={() => addToCart(product)}
												className='w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded transition-colors duration-300 
												flex items-center justify-center'
											>
												<ShoppingCart className='w-5 h-5 mr-2' />
												Add to Cart
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
					<button
						onClick={prevSlide}
						disabled={isStartDisabled}
						className={`absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
							isStartDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"
						}`}
					>
						<ChevronLeft className='w-6 h-6' />
					</button>

					<button
						onClick={nextSlide}
						disabled={isEndDisabled}
						className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
							isEndDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"
						}`}
					>
						<ChevronRight className='w-6 h-6' />
					</button>
				</div>
			</div>
			
			{selectedProduct && (
				<ProductDetail 
					product={selectedProduct} 
					onClose={() => setSelectedProduct(null)}
					onFavoriteChange={handleFavoriteChangeFromModal}
				/>
			)}
		</div>
	);
};
export default FeaturedProducts;
