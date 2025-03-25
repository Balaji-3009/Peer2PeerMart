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

interface WishlistItem {
  id: number;
  productName: string;
  price: number;
  buyer_id: string;
  seller_id: string;
  product_id: number;
  sellerName: string;
  confirmation: number; // 0 - active, 2 - accepted, 3 - canceled
}

export default function WishlistPage() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [chatItem, setChatItem] = useState<WishlistItem | null>(null);
  const [enableAnimations, setEnableAnimations] = useState<boolean>(
    window.innerWidth > 768
  );

  // Handle screen resize to enable/disable animations
  useEffect(() => {
    const handleResize = () => {
      setEnableAnimations(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
            data.data.map((item: any) => ({
              id: item.id,
              productName: item.product_name,
              price: item.price,
              buyer_id: item.buyer_id,
              seller_id: item.seller_id,
              product_id: Number(item.product_id),
              sellerName: item.seller_name,
              confirmation: item.confirmation,
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

  const cancelProduct = async (tranId: number) => {
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
      {/* Sidebar */}
      <div className="w-full md:w-1/4 mb-6 md:mb-0">
        <Sidebar />
      </div>

      {/* Middle Section: Wishlist */}
      <div className="w-full md:w-1/2 flex flex-col items-center">
        <Toaster position="top-right" />
        {enableAnimations ? (
          <motion.div
            className="w-full bg-white shadow-lg rounded-lg overflow-hidden"
            animate={{ x: chatItem ? -170 : 0 }}
            transition={{ type: "spring", stiffness: 1000, damping: 3000 }}
          >
            <WishlistContent
              activeWishlist={activeWishlist}
              acceptedWishlist={acceptedWishlist}
              canceledWishlist={canceledWishlist}
              navigate={navigate}
              cancelProduct={cancelProduct}
              setChatItem={setChatItem}
            />
          </motion.div>
        ) : (
          <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <WishlistContent
              activeWishlist={activeWishlist}
              acceptedWishlist={acceptedWishlist}
              canceledWishlist={canceledWishlist}
              navigate={navigate}
              cancelProduct={cancelProduct}
              setChatItem={setChatItem}
            />
          </div>
        )}
      </div>

      {/* Right Side: Chat Window */}
      <div className="w-full md:w-1/4">
        <AnimatePresence>
          {chatItem && (
            <motion.div
              className="fixed right-0 w-full md:w-96 bg-white rounded-xl shadow-lg overflow-hidden"
              initial={{ x: enableAnimations ? 200 : 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: enableAnimations ? 200 : 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 3000 }}
            >
              <ChatWindow item={chatItem} onClose={() => setChatItem(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* Wishlist Content Component */
function WishlistContent({
  activeWishlist,
  acceptedWishlist,
  canceledWishlist,
  navigate,
  cancelProduct,
  setChatItem,
}: {
  activeWishlist: WishlistItem[];
  acceptedWishlist: WishlistItem[];
  canceledWishlist: WishlistItem[];
  navigate: any;
  cancelProduct: (tranId: number) => void;
  setChatItem: (item: WishlistItem | null) => void;
}) {
  return (
    <Card>
      <CardHeader className="bg-purple-600 text-white p-4 md:p-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold">Your Wishlist</h1>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <WishlistSection
          title="📌 Active Wishlist"
          items={activeWishlist}
          navigate={navigate}
          cancelProduct={cancelProduct}
          setChatItem={setChatItem}
        />
        <WishlistSection
          title="🟢 Accepted Wishlist"
          items={acceptedWishlist}
          navigate={navigate}
          setChatItem={setChatItem}
        />
        <WishlistSection
          title="🔴 Canceled Wishlist"
          items={canceledWishlist}
          navigate={navigate}
          setChatItem={setChatItem}
        />
      </CardContent>
    </Card>
  );
}

/* WishlistSection Component */
function WishlistSection({
  title,
  items,
  navigate,
  cancelProduct,
  setChatItem,
}: {
  title: string;
  items: WishlistItem[];
  navigate?: any;
  cancelProduct?: (tranId: number) => void;
  setChatItem?: (item: WishlistItem | null) => void;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      {items.length > 0 ? (
        items.map((item) => (
          <div
            key={item.id}
            className="p-3 mb-3 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-gray-600">${item.price}</p>
                <p className="text-sm text-gray-500">
                  Seller: {item.sellerName}
                </p>
              </div>
              <div className="flex space-x-2">
                {item.confirmation === 0 && cancelProduct && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => cancelProduct(item.id)}
                  >
                    <XCircle className="h-5 w-5 text-red-500" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setChatItem && setChatItem(item)}
                >
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                </Button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No items available.</p>
      )}
    </div>
  );
}
