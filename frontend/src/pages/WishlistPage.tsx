"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Trash2, MessageCircle } from "lucide-react";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";
import { Toaster, toast } from "sonner";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [chatItem, setChatItem] = useState(null);
  const [chatPosition, setChatPosition] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();
  const chatButtonRefs = useRef({});

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
              imageUrl: item.img_url || "", // Use img_url from API
              seller_id: item.seller_id,
              buyer_id: item.buyer_id,
              product_id: item.product_id,
            }))
          );
        } else {
          toast.error("Failed to fetch wishlist.");
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        toast.error("An error occurred. Please try again.");
      }
    };
    fetchWishlist();
  }, []);

  const removeItem = (id) => {
    setWishlistItems((items) => items.filter((item) => item.id !== id));
  };

  const toggleChat = (item, event) => {
    const buttonRect = chatButtonRefs.current[item.id]?.getBoundingClientRect();
    if (!buttonRect) return;

    const newPosition = {
      top: buttonRect.top + window.scrollY,
      left: buttonRect.right + window.scrollX + 10,
    };

    setChatItem(chatItem && chatItem.id === item.id ? null : item);
    setChatPosition(newPosition);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 relative mt-10">
      <Sidebar />
      <Toaster position="top-right" />

      <Card className="w-full max-w-4xl overflow-hidden">
        <CardHeader className="bg-purple-600 text-white p-6">
          <h1 className="text-3xl font-bold">Your Wishlist</h1>
        </CardHeader>

        <CardContent className="p-6">
          {wishlistItems.length === 0 ? (
            <p className="text-gray-600 text-center">Your wishlist is empty.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {wishlistItems.map((item) => (
                <li key={item.id} className="py-4 flex items-center space-x-4">
                  <img
                    src={item.imageUrl || "https://via.placeholder.com/150"}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.productName}
                    </h3>
                    <p className="text-gray-600">Seller: {item.sellerName}</p>
                    <p className="text-gray-600">${item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-purple-600 hover:text-purple-700"
                      onClick={(e) => toggleChat(item, e)}
                      ref={(el) => (chatButtonRefs.current[item.id] = el)}
                    >
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>

        <CardFooter className="bg-gray-50 p-6 flex justify-between items-center">
          <Button
            variant="outline"
            className="border-purple-600 text-purple-600 hover:bg-purple-100"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </Button>
        </CardFooter>
      </Card>

      {chatItem && (
        <ChatWindow
          item={{
            ...chatItem,
            buyer_id: chatItem.buyer_id,
            seller_id: chatItem.seller_id,
            product_id: chatItem.product_id,
          }}
          onClose={() => setChatItem(null)}
          position={chatPosition}
        />
      )}
    </div>
  );
}
