import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, XCircle } from "lucide-react";
import ChatWindow from "../components/chatWindow";
import Sidebar from "../components/SideBar";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [chatItem, setChatItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const chatRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      setIsLoading(true);
      try {
        const idToken = localStorage.getItem("idToken");
        const userId = localStorage.getItem("uuid");

        if (!userId) {
          console.error("User ID not found. Please log in.");
          return;
        }

        const response = await fetch(
          `https://peer2peermart.onrender.com/transactions/getWishList?user_id=${userId}`,
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
              sellerName: item.seller_name,
              imageUrl: item.img_url || "",
              seller_id: item.seller_id,
              buyer_id: item.buyer_id,
              product_id: item.product_id,
              confirmation: item.confirmation,
            }))
          );
          toast.success("Wishlist fetched successfully");
        } else {
          toast.error("Failed to fetch wishlist");
        }
      } catch (error) {
        toast.error("Error fetching wishlist");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const cancelProduct = async (tranId) => {
    try {
      const idToken = localStorage.getItem("idToken");
      const url = `https://peer2peermart.onrender.com/transactions/updateTransaction?tranId=${tranId}&tranStatus=3`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Product cancelled successfully");
        setWishlistItems((items) =>
          items.map((item) =>
            item.id === tranId ? { ...item, confirmation: 3 } : item
          )
        );
      } else {
        toast.error("Failed to cancel product");
      }
    } catch (error) {
      toast.error("Failed to cancel product");
    }
  };

  // Close ChatWindow when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setChatItem(null);
      }
    };

    if (chatItem) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [chatItem]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 relative pt-24">
      <Sidebar />
      <Toaster position="top-right" />

      <div className="relative w-full flex justify-center">
        <motion.div
          className="w-full max-w-4xl bg-white rounded-xl shadow-md overflow-hidden transition-all"
          animate={
            window.innerWidth >= 768 && chatItem ? { x: -120 } : { x: 0 }
          }
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          <div className="bg-purple-600 text-white p-6">
            <h1 className="text-3xl font-bold">Your Wishlist</h1>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
              </div>
            ) : wishlistItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-6">
                  Your wishlist is empty.
                </p>
                <button
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  onClick={() => navigate("/products")}
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {wishlistItems.map((item) => (
                  <li
                    key={item.id}
                    className={`py-4 flex items-center space-x-4 p-2 transition-opacity ${
                      item.confirmation === 3 || item.confirmation == 2
                        ? "opacity-40"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.productName}
                      </h3>
                      <p className="text-gray-600">Seller: {item.sellerName}</p>
                      <p className="text-purple-600 font-medium">
                        &#x20B9;{item.price}
                      </p>
                      {item.confirmation === 3 && (
                        <p className="text-gray-500 font-medium">
                          Cancelled by You
                        </p>
                      )}
                      {item.confirmation === 2 && (
                        <p className="text-gray-500 font-medium">
                          Accepted by buyer
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.confirmation !== 3 && (
                        <button
                          className="text-purple-600 hover:text-purple-700 p-2 rounded-full hover:bg-purple-100 transition-colors"
                          onClick={() => setChatItem(item)}
                        >
                          <MessageCircle className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                        onClick={() => cancelProduct(item.id)}
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {chatItem && (
            <motion.div
              ref={chatRef}
              className="absolute right-0 w-full sm:w-96 bg-white rounded-xl shadow-lg overflow-hidden"
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
