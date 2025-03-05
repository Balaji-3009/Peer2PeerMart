"use client";

import { useState, useRef } from "react";
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
// Dummy wishlist data
const initialWishlistItems = [
  { id: 1, name: "Smartphone X", price: 799.99 },
  { id: 2, name: "Laptop Pro", price: 1299.99 },
  { id: 3, name: "Wireless Earbuds", price: 149.99 },
];

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);
  const [chatItem, setChatItem] = useState(null);
  const [chatPosition, setChatPosition] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();
  const chatButtonRefs = useRef({});

  const removeItem = (id) => {
    setWishlistItems((items) => items.filter((item) => item.id !== id));
  };

  const toggleChat = (item, event) => {
    const buttonRect = chatButtonRefs.current[item.id].getBoundingClientRect();
    const newPosition = {
      top: buttonRect.top + window.scrollY,
      left: buttonRect.right + window.scrollX + 10, // 10px offset from the button
    };

    if (chatItem && chatItem.id === item.id) {
      setChatItem(null);
    } else {
      setChatItem(item);
      setChatPosition(newPosition);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 relative">
      <Sidebar />
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
                <li
                  key={item.id}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
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

      {/* Chat Window */}
      {chatItem && (
        <ChatWindow
          item={chatItem}
          onClose={() => setChatItem(null)}
          position={chatPosition}
        />
      )}
    </div>
  );
}
