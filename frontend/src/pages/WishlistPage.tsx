import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { MessageCircle, XCircle } from "lucide-react";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function WishlistPage() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [chatItem, setChatItem] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const idToken = localStorage.getItem("idToken");
        const userId = localStorage.getItem("uuid");

        if (!userId) {
          toast.error("User ID not found. Please log in.");
          return;
        }

        const response = await fetch(
          `${VITE_BACKEND_URL}/transactions/getWishList?user_id=${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        const data = await response.json();

        if (data.status === "success") {
          setWishlistItems(
            data.data.map((item) => ({
              id: item.id,
              productName: item.product_name,
              price: item.price,
              buyer_id: item.buyer_id,
              seller_id: item.seller_id,
              product_id: Number(item.product_id),
              sellerName: item.seller_name,
              confirmation: item.confirmation, // 0 - active, 2 - accepted, 3 - canceled
            }))
          );
        } else {
          toast.error("Failed to fetch wishlist.");
        }
      } catch (error) {
        toast.error("Error fetching wishlist.");
      }
    };

    fetchWishlist();
  }, []);

  const cancelProduct = async (tranId) => {
    try {
      const idToken = localStorage.getItem("idToken");
      const response = await fetch(
        `${VITE_BACKEND_URL}/transactions/updateTransaction?tranId=${tranId}&tranStatus=3`,
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
        toast.success("Product canceled successfully.");
        setWishlistItems((items) =>
          items.map((item) =>
            item.id === tranId ? { ...item, confirmation: 3 } : item
          )
        );
      } else {
        toast.error("Failed to cancel product.");
      }
    } catch (error) {
      toast.error("Failed to cancel product.");
    }
  };

  const activeWishlist = wishlistItems.filter(
    (item) => item.confirmation === 0
  );
  const acceptedWishlist = wishlistItems.filter(
    (item) => item.confirmation === 2
  );
  const canceledWishlist = wishlistItems.filter(
    (item) => item.confirmation === 3
  );

  return (
    <div className="min-h-screen mt-16 bg-gray-50 flex flex-col md:flex-row p-4 md:p-6 relative pt-16">
      {/* Sidebar (Collapsible for smaller screens) */}
      <div className="w-full md:w-1/4 mb-6 md:mb-0">
        <Sidebar />
      </div>

      {/* Middle Section (Wishlist Items) */}
      <div className="w-full md:w-1/2 flex flex-col items-center">
        <Toaster position="top-right" />
        <motion.div
          className="w-full bg-white shadow-lg rounded-lg overflow-hidden transition-all"
          animate={{ x: chatItem ? -100 : 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          <Card>
            <CardHeader className="bg-purple-600 text-white p-4 md:p-6 text-center">
              <h1 className="text-2xl md:text-3xl font-bold">Your Wishlist</h1>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              {/* Active Wishlist */}
              <WishlistSection
                title="📌 Active Wishlist"
                items={activeWishlist}
                navigate={navigate}
                cancelProduct={cancelProduct}
                setChatItem={setChatItem}
              />

              {/* Canceled Wishlist */}
              <WishlistSection
                title="❌ Canceled Wishlist"
                items={canceledWishlist}
                navigate={navigate}
                setChatItem={setChatItem}
              />

              {/* Accepted Wishlist */}
              <WishlistSection
                title="✅ Accepted Wishlist"
                items={acceptedWishlist}
                navigate={navigate}
                setChatItem={setChatItem}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Right Side: Chat Window (Full-width on small screens) */}
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

/* Wishlist Section Component */
function WishlistSection({
  title,
  items,
  navigate,
  cancelProduct,
  setChatItem,
}) {
  return (
    <div className="mt-6">
      <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
        {title}
      </h2>
      {items.length === 0 ? (
        <p className="text-gray-500">No items in this category.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <WishlistItem
              key={item.id}
              item={item}
              navigate={navigate}
              cancelProduct={cancelProduct}
              setChatItem={setChatItem}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

/* Wishlist Item Component */
function WishlistItem({ item, navigate, cancelProduct, setChatItem }) {
  return (
    <li
      className="relative flex flex-col md:flex-row items-center justify-between p-4 bg-white rounded-lg shadow-md border cursor-pointer transition-transform transform hover:scale-105"
      onClick={() => navigate(`/product/${item.product_id}`)}
    >
      <div className="flex-1">
        <h3 className="text-lg md:text-xl font-bold text-purple-700">
          {item.productName}
        </h3>
        <p className="text-gray-600 text-sm">Seller: {item.sellerName}</p>
        <p className="text-purple-600 font-medium text-lg md:text-xl">
          &#x20B9;{item.price}
        </p>
      </div>
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setChatItem(item); }}>
          <MessageCircle className="h-6 w-6 text-purple-600" />
        </Button>
        {item.confirmation === 0 && (
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); cancelProduct(item.id); }}>
            <XCircle className="h-6 w-6 text-red-500" />
          </Button>
        )}
      </div>
    </li>
  );
}
