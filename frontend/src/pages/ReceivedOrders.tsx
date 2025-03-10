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
          `https://peer2peermart.onrender.com/transactions/getMyOrders?user_id=${userId}`,
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
      const url = `https://peer2peermart.onrender.com/transactions/updateTransaction?tranId=${tranId}&tranStatus=${status}`;
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 relative pt-24">
      <Sidebar />
      <Toaster position="top-right" />

      <div className="w-full max-w-6xl flex justify-center">
        <motion.div
          className="w-full max-w-4xl overflow-hidden"
          animate={{ x: chatItem ? -100 : 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          <Card>
            <CardHeader className="bg-purple-600 text-white p-6">
              <h1 className="text-3xl font-bold">Received Orders</h1>
            </CardHeader>
            <CardContent className="p-6">
              {orders.length === 0 ? (
                <p className="text-gray-600 text-center">
                  No orders received yet.
                </p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <li
                      key={order.id}
                      className={`py-4 flex items-center justify-between ${
                        order.confirmation
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }`}
                    >
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => navigate(`/product/${order.product_id}`)}
                      >
                        <h3 className="text-lg font-semibold text-gray-800">
                          {order.name}
                        </h3>
                        <p className="text-gray-600">&#x20B9;{order.price}</p>
                        <p className="text-sm text-gray-500">
                          Buyer: {order.buyer}
                        </p>
                        {order.confirmation === 1 && (
                          <p className="text-red-500">Rejected by you</p>
                        )}
                        {order.confirmation === 2 && (
                          <p className="text-green-500">Accepted by you</p>
                        )}
                        {order.confirmation === 3 && (
                          <p className="text-gray-500">Cancelled by Buyer</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-purple-600 hover:text-purple-700"
                          onClick={() => setChatItem(order)}
                        >
                          <MessageCircle className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-green-500 hover:text-green-700"
                          onClick={() => updateTransaction(order.id, 2)}
                          disabled={order.confirmation === 2}
                        >
                          <CheckCircle className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => updateTransaction(order.id, 1)}
                          disabled={order.confirmation === 1}
                        >
                          <XCircle className="h-5 w-5" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {chatItem && (
            <motion.div
              className="absolute right-0 w-96 bg-white rounded-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
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
