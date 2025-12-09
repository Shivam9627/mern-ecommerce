import { create } from "zustand";
import axios from "../lib/axios";

const useOrderStore = create((set) => ({
  orders: [],
  isLoading: false,

  fetchAllOrders: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get("/orders/all-orders");
      set({ orders: response.data });
    } catch (error) {
      console.error("Error fetching all orders:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await axios.patch(`/orders/${orderId}/status`, { status });
      // Update the order in the list
      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId ? response.data : order
        ),
      }));
    } catch (error) {
      console.error("Error updating order:", error);
    }
  },
}));

export default useOrderStore;
