import React, { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import axios from "../lib/axios";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

const MyOrders = () => {
  const { user } = useUserStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/orders/my-orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case "shipped":
        return <Package className="w-5 h-5 text-blue-400" />;
      case "on-the-way":
        return <Truck className="w-5 h-5 text-orange-400" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "shipped":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "on-the-way":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "delivered":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-white mb-2">My Orders</h1>
      <p className="text-gray-400 mb-8">Track your purchases and delivery status</p>

      {orders.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No orders yet</p>
          <a href="/" className="text-emerald-400 hover:text-emerald-300 mt-2 inline-block">
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800/50">
              {/* Order Header */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-700/50 transition"
                onClick={() =>
                  setExpandedOrder(expandedOrder === order._id ? null : order._id)
                }
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-400">Order ID</p>
                    <p className="text-white font-semibold">{order._id.substring(0, 8)}...</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-white font-semibold">${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace("-", " ")}
                  </span>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order._id && (
                <div className="border-t border-gray-700 p-6 bg-gray-900/50">
                  {/* Products */}
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3">Items Ordered</h4>
                    {order.products && order.products.length > 0 ? (
                      <div className="space-y-2">
                        {order.products.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-gray-300">
                            <span>
                              {item.product?.name || "Product"} x{item.quantity}
                            </span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No items found</p>
                    )}
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="mb-6">
                      <h4 className="text-white font-semibold mb-3">Shipping To</h4>
                      <div className="text-gray-300 text-sm">
                        <p>{order.shippingAddress.street}</p>
                        <p>
                          {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                          {order.shippingAddress.postalCode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                        <p className="mt-2 text-gray-400">Phone: {order.shippingAddress.phone}</p>
                      </div>
                    </div>
                  )}

                  {/* Tracking Timeline */}
                  <div>
                    <h4 className="text-white font-semibold mb-3">Tracking</h4>
                    <div className="space-y-3">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-4 h-4 rounded-full ${order.status ? "bg-emerald-400" : "bg-gray-600"}`}></div>
                          <div className="w-0.5 h-8 bg-gray-600 my-1"></div>
                        </div>
                        <div>
                          <p className="text-white font-semibold">Order Confirmed</p>
                          <p className="text-sm text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {["shipped", "on-the-way", "delivered"].includes(order.status) && (
                        <>
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-4 h-4 rounded-full bg-emerald-400"></div>
                              <div className="w-0.5 h-8 bg-gray-600 my-1"></div>
                            </div>
                            <div>
                              <p className="text-white font-semibold">Shipped</p>
                              <p className="text-sm text-gray-400">Your order is on its way</p>
                            </div>
                          </div>
                        </>
                      )}

                      {["on-the-way", "delivered"].includes(order.status) && (
                        <>
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-4 h-4 rounded-full bg-emerald-400"></div>
                              <div className="w-0.5 h-8 bg-gray-600 my-1"></div>
                            </div>
                            <div>
                              <p className="text-white font-semibold">On The Way</p>
                              <p className="text-sm text-gray-400">Delivery in progress</p>
                            </div>
                          </div>
                        </>
                      )}

                      {order.status === "delivered" && (
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-4 h-4 rounded-full bg-emerald-400"></div>
                          </div>
                          <div>
                            <p className="text-white font-semibold">Delivered</p>
                            <p className="text-sm text-gray-400">Package delivered successfully</p>
                          </div>
                        </div>
                      )}
                    </div>
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

export default MyOrders;
