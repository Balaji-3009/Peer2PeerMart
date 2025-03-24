"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function ChatWindow({ item, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const messagesEndRef = useRef(null);

  const uuid = localStorage.getItem("uuid");
  const idToken = localStorage.getItem("idToken");
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages([]);
    const createChat = async () => {
      try {
        const response = await fetch(`${VITE_BACKEND_URL}/chats/create_chat/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            buyer_id: item.buyer_id,
            seller_id: item.seller_id,
            product_id: item.product_id,
          }),
        });
        const data = await response.json();
        if (data.chat_id) {
          setChatId(data.chat_id);
        }
      } catch (error) {
        console.error("Error creating chat:", error);
      }
    };
    createChat();
  }, [item, idToken]);

  useEffect(() => {
    if (!chatId || !uuid) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${VITE_BACKEND_URL}/chats/messages/${chatId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          }
        );
        console.log(`${VITE_BACKEND_URL}/chats/messages/${chatId}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();

    let ws;
    const connectWebSocket = () => {
      ws = new WebSocket(
        `wss://peer2peermart.onrender.com/chats/ws/${chatId}/${uuid}`
      );
      ws.onopen = () => console.log("Connected to WebSocket");
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMessages((prev) => [...prev, data]);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
      ws.onerror = (error) => console.error("WebSocket error:", error);
      ws.onclose = (event) => {
        console.log("Disconnected from WebSocket", event.code, event.reason);
        if (!event.wasClean) {
          setTimeout(connectWebSocket, 3000);
        }
      };
      setSocket(ws);
    };
    connectWebSocket();

    return () => {
      if (ws) ws.close();
    };
  }, [chatId, uuid, idToken]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (socket && inputMessage.trim()) {
      const messageData = {
        sender_id: uuid,
        content: inputMessage,
      };
      socket.send(JSON.stringify(messageData));
      setInputMessage("");
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={`fixed bottom-0 right-0 z-50 w-full md:w-96 shadow-2xl transform transition-all duration-300 ease-out ${
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-20 opacity-0 scale-95"
      } bg-white border-l border-t border-gray-200 flex flex-col md:h-[calc(100vh-4rem)] h-[70vh] rounded-t-xl md:rounded-none`}
    >
      <div className="bg-purple-600 text-white p-4 flex justify-between items-center rounded-t-xl md:rounded-none">
        <h2 className="text-lg font-semibold truncate">
          Chat about {item.product_name}
        </h2>
        <button
          onClick={handleClose}
          className="hover:bg-purple-700 rounded-full p-1 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Start a conversation about this item</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`mb-3 flex ${
                message.sender_id === uuid ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-xl max-w-[75%] text-sm shadow-md ${
                  message.sender_id === uuid
                    ? "bg-gradient-to-r from-violet-400 to-violet-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                <p>{message.content}</p>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
