import React, { useEffect, useState } from "react";
import axios from "../lib/axios";
import { ChevronDown, ChevronUp } from "lucide-react";

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/orders/all-orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await axios.patch(`/orders/${orderId}/status`, { status: newStatus });
      // Refetch orders to get updated data
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading orders...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">All Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No orders found</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              {/* Order Header */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-700/50 transition flex items-center justify-between"
                onClick={() =>
                  setExpandedOrder(expandedOrder === order._id ? null : order._id)
                }
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div>
                      <p className="text-sm text-gray-400">Order ID</p>
                      <p className="text-white font-semibold">{order._id.substring(0, 8)}...</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Customer</p>
                      <p className="text-white">{order.user?.name || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Amount</p>
                      <p className="text-white font-semibold">${order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Payment</p>
                      <p className="text-white">
                        {(order.paymentMethod || "card").toUpperCase()} • {(order.paymentStatus || "paid").toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <select
                        value={order.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateOrderStatus(order._id, e.target.value);
                        }}
                        disabled={updatingId === order._id}
                        className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="on-the-way">On The Way</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  {expandedOrder === order._id ? (
                    <ChevronUp className="text-gray-400" />
                  ) : (
                    <ChevronDown className="text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order._id && (
                <div className="border-t border-gray-700 p-4 bg-gray-900/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Products */}
                    <div>
                      <h4 className="text-white font-semibold mb-3">Items</h4>
                      {order.products && order.products.length > 0 ? (
                        <div className="space-y-2">
                          {order.products.map((item, idx) => (
                            <div key={idx} className="text-sm text-gray-300 flex justify-between">
                              <span>{item.product?.name || "Product"} x{item.quantity}</span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400">No items</p>
                      )}
                    </div>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                      <div>
                        <h4 className="text-white font-semibold mb-3">Shipping Address</h4>
                        <div className="text-sm text-gray-300">
                          <p>{order.shippingAddress.street}</p>
                          <p>
                            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                            {order.shippingAddress.postalCode}
                          </p>
                          <p>{order.shippingAddress.country}</p>
                          <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Info */}
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400">
                      Ordered: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    {order.stripeSessionId && (
                      <p className="text-sm text-gray-400">
                        Stripe Session: {order.stripeSessionId.substring(0, 12)}...
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
