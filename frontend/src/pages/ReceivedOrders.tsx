import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { MessageCircle, CheckCircle, XCircle } from "lucide-react";
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

  const availableOrders = orders.filter((order) => order.confirmation === 0);
  const acceptedOrders = orders.filter((order) => order.confirmation === 2);
  const cancelledOrders = orders.filter((order) => order.confirmation === 3);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row p-6 relative pt-24">
      {/* Sidebar (Left) */}
      <div className="w-full md:w-1/4 mb-6 md:mb-0">
        <Sidebar />
      </div>

      {/* Middle Section (Orders List) */}
      <div className="w-full md:w-1/2 flex flex-col items-center">
        <Toaster position="top-right" />
        <motion.div
          className="w-full bg-white shadow-lg rounded-lg overflow-hidden transition-all"
          animate={{ x: chatItem ? -100 : 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          <Card>
            <CardHeader className="bg-purple-600 text-white p-6 text-center">
              <h1 className="text-3xl font-bold">Received Orders</h1>
            </CardHeader>
            <CardContent className="p-6">
              {/* Available Orders */}
              <OrderSection
                title="📌 Available Orders"
                orders={availableOrders}
                navigate={navigate}
                setChatItem={setChatItem}
                setOrders={setOrders}
              />

              {/* Cancelled Orders (No action buttons) */}
              <OrderSection
                title="❌ Cancelled Orders"
                orders={cancelledOrders}
                navigate={navigate}
                setChatItem={setChatItem}
                setOrders={setOrders}
                hideActions
              />

              {/* Accepted Orders */}
              <OrderSection
                title="✅ Accepted Orders"
                orders={acceptedOrders}
                navigate={navigate}
                setChatItem={setChatItem}
                setOrders={setOrders}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Right Side: Chat Window */}
      <div className="w-full md:w-1/4">
        <AnimatePresence>
          {chatItem && (
            <motion.div
              className="fixed right-0 w-full md:w-96 bg-white rounded-xl shadow-lg overflow-hidden"
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

/* Order Section Component */
function OrderSection({
  title,
  orders,
  navigate,
  setChatItem,
  setOrders,
  hideActions = false,
}) {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">{title}</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <OrderItem
              key={order.id}
              order={order}
              navigate={navigate}
              setChatItem={setChatItem}
              setOrders={setOrders}
              hideActions={hideActions}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
function OrderItem({ order, navigate, setChatItem, setOrders }) {
  const handleUpdateStatus = async (newStatus, e) => {
    e.stopPropagation(); // Prevent navigation to product page

    try {
      const idToken = localStorage.getItem("idToken");

      const response = await fetch(
        `${VITE_BACKEND_URL}/transactions/updateTransaction?tranStatus=${newStatus}&tranId=${order.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        toast.success(`Order ${newStatus === 2 ? "Accepted" : "Cancelled"}`);
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.id === order.id ? { ...o, confirmation: newStatus } : o
          )
        );
      } else {
        toast.error("Failed to update order.");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <li
      className="relative flex flex-col sm:flex-row items-center justify-between p-4 bg-white rounded-lg shadow-md border cursor-pointer transition-transform transform hover:scale-105"
      onClick={() => navigate(`/product/${order.product_id}`)}
    >
      <div className="flex-1">
        <h3 className="text-lg font-bold text-purple-700">{order.name}</h3>
        <p className="text-gray-600 text-sm">Buyer: {order.buyer}</p>
        <p className="text-purple-600 font-medium text-lg">
          &#x20B9;{order.price}
        </p>
      </div>
      <div className="flex items-center space-x-3">
        {order.confirmation === 0 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleUpdateStatus(2, e)}
            >
              <CheckCircle className="h-6 w-6 text-green-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleUpdateStatus(3, e)}
            >
              <XCircle className="h-6 w-6 text-red-600" />
            </Button>
          </>
        )}

        {order.confirmation === 2 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setChatItem(order);
            }}
          >
            <MessageCircle className="h-6 w-6 text-purple-600" />
          </Button>
        )}
      </div>
    </li>
  );
}
