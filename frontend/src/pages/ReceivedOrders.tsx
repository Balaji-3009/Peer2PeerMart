import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Trash2, MessageCircle, CheckCircle, XCircle } from "lucide-react";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ReceivedOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [chatItem, setChatItem] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const idToken = localStorage.getItem("idToken");
        const userId = localStorage.getItem("uuid");

        if (!userId) {
          toast.error("User ID not found. Please log in.");
          return;
        }

        const response = await fetch(
          `${VITE_BACKEND_URL}/transactions/getMyOrders?user_id=${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        const data = await response.json();

        if (data.status === "success") {
          setOrders(
            data.data.map((order) => ({
              id: order.id,
              name: order.product_name,
              price: order.price,
              buyer: order.buyer_name,
              seller_id: order.seller_id,
              buyer_id: order.buyer_id,
              product_id: order.product_id,
              confirmation: order.confirmation,
            }))
          );
        } else {
          toast.error("Failed to fetch orders.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("An error occurred. Please try again.");
      }
    };

    fetchOrders();
  }, []);

  const updateTransaction = async (tranId, status) => {
    try {
      const idToken = localStorage.getItem("idToken");
      const url = `${VITE_BACKEND_URL}/transactions/updateTransaction?tranId=${tranId}&tranStatus=${status}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await response.json();

      if (data.status === "success") {
        toast.success(
          status === 2 ? "Product accepted successfully" : "Product rejected"
        );
        setOrders((items) =>
          items.map((item) =>
            item.id === tranId ? { ...item, confirmation: status } : item
          )
        );
      } else {
        toast.error("Failed to update transaction");
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Failed to update transaction");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 relative pt-24">
      <Sidebar />
      <Toaster position="top-right" />

      <div className="w-full max-w-6xl flex justify-center">
        <motion.div
          className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden transition-all"
          animate={{ x: chatItem ? -100 : 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          <Card>
            <CardHeader className="bg-purple-600 text-white p-6 text-center">
              <h1 className="text-3xl font-bold">Received Orders</h1>
            </CardHeader>
            <CardContent className="p-6">
              {orders.length === 0 ? (
                <p className="text-gray-600 text-center text-lg">
                  No orders received yet.
                </p>
              ) : (
                <ul className="space-y-4">
                  {orders.map((order) => (
                    <li
                      key={order.id}
                      className={`relative flex flex-col sm:flex-row items-center justify-between p-4 bg-white rounded-lg shadow-md border cursor-pointer transition-transform transform hover:scale-105 ${
                        order.confirmation === 3
                          ? "bg-gray-200 opacity-50"
                          : order.confirmation === 2
                          ? "border-green-500"
                          : "border-gray-300"
                      }`}
                      onClick={() => navigate(`/product/${order.product_id}`)}
                    >
                      {/* Left Side - Product Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-purple-700">
                          {order.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Buyer: {order.buyer}
                        </p>
                        <p className="text-purple-600 font-medium text-lg">
                          &#x20B9;{order.price}
                        </p>

                        {/* Status Badge */}
                        {order.confirmation === 2 && (
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs">
                            Accepted
                          </span>
                        )}
                        {order.confirmation === 1 && (
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs">
                            Rejected
                          </span>
                        )}
                        {order.confirmation === 3 && (
                          <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs">
                            Cancelled by Buyer
                          </span>
                        )}
                      </div>

                      {/* Right Side - Action Buttons */}
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-purple-600 hover:text-purple-800 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setChatItem(order);
                          }}
                        >
                          <MessageCircle className="h-6 w-6" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-green-500 hover:text-green-700 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateTransaction(order.id, 2);
                          }}
                          disabled={order.confirmation === 2}
                        >
                          <CheckCircle className="h-6 w-6" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateTransaction(order.id, 1);
                          }}
                          disabled={order.confirmation === 1}
                        >
                          <XCircle className="h-6 w-6" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Chat Window - Right Sidebar */}
        <AnimatePresence>
          {chatItem && (
            <motion.div
              className="absolute right-0 w-96 bg-white rounded-xl shadow-lg overflow-hidden"
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 200, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <ChatWindow item={chatItem} onClose={() => setChatItem(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
