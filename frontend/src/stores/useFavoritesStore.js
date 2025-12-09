import { create } from "zustand";
import axios from "../lib/axios";

export const useFavoritesStore = create((set, get) => ({
  favorites: [],
  isFavorite: (productId) => {
    return get().favorites.some((fav) => fav._id === productId);
  },

  fetchFavorites: async () => {
    try {
      const response = await axios.get("/favorites");
      console.log("Fetched favorites:", response.data);
      set({ favorites: response.data || [] });
    } catch (error) {
      console.error("Error fetching favorites:", error.response?.data || error.message);
      set({ favorites: [] });
    }
  },

  addToFavorites: async (product) => {
    try {
      console.log("Adding to favorites:", product._id);
      await axios.post("/favorites", { productId: product._id });
      console.log("Added to favorites successfully");
      set((prevState) => {
        const isFav = prevState.favorites.some((fav) => fav._id === product._id);
        const newFavorites = isFav
          ? prevState.favorites
          : [...prevState.favorites, product];
        console.log("Updated favorites state:", newFavorites);
        return { favorites: newFavorites };
      });
    } catch (error) {
      console.error("Error adding to favorites:", error.response?.data || error.message);
    }
  },

  removeFromFavorites: async (productId) => {
    try {
      console.log("Removing from favorites:", productId);
      await axios.delete("/favorites", { data: { productId } });
      set((prevState) => ({
        favorites: prevState.favorites.filter((fav) => fav._id !== productId),
      }));
    } catch (error) {
      console.error("Error removing from favorites:", error.response?.data || error.message);
    }
  },
}));
