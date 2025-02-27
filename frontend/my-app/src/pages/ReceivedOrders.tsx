"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Trash2, MessageCircle, CheckCircle } from "lucide-react";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
// Dummy received orders data
const initialReceivedOrders = [
  { id: 1, name: "Smartphone X", price: 799.99, buyer: "John Doe" },
  { id: 2, name: "Laptop Pro", price: 1299.99, buyer: "Jane Smith" },
  { id: 3, name: "Wireless Earbuds", price: 149.99, buyer: "Bob Johnson" },
];

export default function ReceivedOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(initialReceivedOrders);
  const [chatItem, setChatItem] = useState(null);
  const [chatPosition, setChatPosition] = useState({ top: 0, left: 0 });
  const chatButtonRefs = useRef({});

  const removeOrder = (id) => {
    setOrders((items) => items.filter((item) => item.id !== id));
  };

  const markAsSold = (id) => {
    setOrders((items) =>
      items.map((item) => (item.id === id ? { ...item, sold: true } : item))
    );
  };

  const toggleChat = (item, event) => {
    const buttonRect = chatButtonRefs.current[item.id].getBoundingClientRect();
    const newPosition = {
      top: buttonRect.top + window.scrollY,
      left: buttonRect.right + window.scrollX + 10,
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
          <h1 className="text-3xl font-bold">Received Orders</h1>
        </CardHeader>
        <CardContent className="p-6">
          {orders.length === 0 ? (
            <p className="text-gray-600 text-center">No orders received yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {order.name}
                    </h3>
                    <p className="text-gray-600">${order.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">
                      Buyer: {order.buyer}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-purple-600 hover:text-purple-700"
                      onClick={(e) => toggleChat(order, e)}
                      ref={(el) => (chatButtonRefs.current[order.id] = el)}
                    >
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-green-500 hover:text-green-700"
                      onClick={() => markAsSold(order.id)}
                      disabled={order.sold}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeOrder(order.id)}
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
