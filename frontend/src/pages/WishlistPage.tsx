import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Trash2, MessageCircle } from "lucide-react";
import ChatWindow from "../components/chatWindow";
import Sidebar from "../components/SideBar";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [chatItem, setChatItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

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
            }))
          );
        } else {
          console.error("Failed to fetch wishlist.");
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const removeItem = async (id) => {
    try {
      const idToken = localStorage.getItem("idToken");

      // Here you would typically call an API to remove the item
      // For now, we'll just update the UI
      setWishlistItems((items) => items.filter((item) => item.id !== id));

      // Show a toast notification
      showToast("Item removed from wishlist");
    } catch (error) {
      console.error("Error removing item:", error);
      showToast("Failed to remove item", true);
    }
  };

  const toggleChat = (item) => {
    setChatItem(chatItem && chatItem.id === item.id ? null : item);
  };

  const showToast = (message, isError = false) => {
    // Simple toast implementation
    const toast = document.createElement("div");
    toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg text-white ${
      isError ? "bg-red-500" : "bg-green-500"
    } shadow-lg z-50 transition-opacity duration-300`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 relative  mt-24">
      <Sidebar />
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md overflow-hidden ">
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
                onClick={() => (window.location.href = "/products")}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {wishlistItems.map((item) => (
                <li
                  key={item.id}
                  className="py-4 flex items-center space-x-4 hover:bg-gray-50 rounded-lg p-2 transition-colors"
                >
                  {/* Make the product item clickable */}
                  <div
                    className="flex-1 flex items-center space-x-4 cursor-pointer"
                    onClick={() => navigate(`/product/${item.product_id}`)}
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.productName}
                      </h3>
                      <p className="text-gray-600">Seller: {item.sellerName}</p>
                      <p className="text-purple-600 font-medium">
                        &#x20B9;{item.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="text-purple-600 hover:text-purple-700 p-2 rounded-full hover:bg-purple-100 transition-colors"
                      onClick={() => toggleChat(item)}
                    >
                      <MessageCircle className="h-5 w-5" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-gray-50 p-6 flex justify-between items-center">
          <button
            className="border border-purple-600 text-purple-600 px-6 py-2 rounded-lg hover:bg-purple-50 transition-colors"
            onClick={() => (window.location.href = "/products")}
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {chatItem && (
        <ChatWindow item={chatItem} onClose={() => setChatItem(null)} />
      )}
    </div>
  );
}
