import toast from "react-hot-toast";
import { ShoppingCart, Eye, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useFavoritesStore } from "../stores/useFavoritesStore";
import ProductDetail from "./ProductDetail";

const ProductCard = ({ product }) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();
	const { isFavorite, addToFavorites, removeFromFavorites } = useFavoritesStore();
	const [showDetail, setShowDetail] = useState(false);
	const [isFav, setIsFav] = useState(false);

	useEffect(() => {
		setIsFav(isFavorite(product._id));
	}, [product._id, isFavorite]);

	const handleAddToCart = (e) => {
		e.stopPropagation();
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		} else {
			addToCart(product);
			toast.success("Added to cart!");
		}
	};

	const handleToggleFavorite = async (e) => {
		e.stopPropagation();
		if (isFav) {
			await removeFromFavorites(product._id);
			setIsFav(false);
			toast.success("Removed from favorites");
		} else {
			await addToFavorites(product);
			setIsFav(true);
			toast.success("Added to favorites");
		}
	};

	const handleFavoriteChangeFromModal = (productId, isFav) => {
		setIsFav(isFav);
	};

	return (
		<>
			<div
				className='flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg hover:shadow-xl transition cursor-pointer h-full'
				onClick={() => setShowDetail(true)}
			>
				<div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl group'>
					<img className='object-cover w-full' src={product.image} alt='product image' />
					<div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition' />
					
					{/* Favorite Button */}
					<button
						onClick={handleToggleFavorite}
						className='absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition z-10'
					>
						<Heart size={20} className={isFav ? "fill-red-500 text-red-500" : "text-white"} />
					</button>

					{/* View Icon */}
					<button
						className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition'
						onClick={() => setShowDetail(true)}
					>
						<Eye size={40} className='text-white' />
					</button>
				</div>

				<div className='mt-4 px-5 pb-5 flex-1 flex flex-col'>
					<h5 className='text-xl font-semibold tracking-tight text-white'>{product.name}</h5>
					<div className='mt-2 mb-4 flex items-center justify-between flex-1'>
						<p>
							<span className='text-3xl font-bold text-emerald-400'>${product.price}</span>
						</p>
					</div>
					<button
						className='flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
						 text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 w-full'
						onClick={handleAddToCart}
					>
						<ShoppingCart size={22} className='mr-2' />
						Add to cart
					</button>
				</div>
			</div>

			{showDetail && <ProductDetail product={product} onClose={() => setShowDetail(false)} onFavoriteChange={handleFavoriteChangeFromModal} />}
		</>
	);
};
export default ProductCard;
