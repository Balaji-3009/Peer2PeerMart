import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { X } from "lucide-react";

export default function ChatWindow({ item, onClose, position }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [chatId, setChatId] = useState(null);
  const uuid = localStorage.getItem("uuid");
  const idToken = localStorage.getItem("idToken");
  useEffect(() => {
    setMessages([]);
    console.log(item);
    const createChat = async () => {
      try {
        const response = await fetch(
          "https://peer2peermart.onrender.com/chats/create_chat/",
          {
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
          }
        );

        const data = await response.json();
        if (data.chat_id) {
          setChatId(data.chat_id);
          console.log(chatId);
        }
      } catch (error) {
        console.error("Error creating chat:", error);
      }
    };

    createChat();
  }, [item]);

  useEffect(() => {
    if (!chatId || !uuid) return;

    // Fetch previous messages
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `https://peer2peermart.onrender.com/chats/messages/${chatId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        const data = await response.json();
        setMessages(data); // Set fetched messages
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

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = (event) => {
        console.log("Disconnected from WebSocket", event.code, event.reason);
        // Attempt to reconnect after 3 seconds if closed unexpectedly
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
  }, [chatId, uuid]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (socket && inputMessage.trim()) {
      const messageData = {
        sender_id: uuid, // Ensure sender_id is included
        content: inputMessage,
      };
      socket.send(JSON.stringify(messageData));
      setInputMessage("");
    }
  };

  return (
    <Card
      className="fixed w-80 h-96 z-50 flex flex-col shadow-lg transition-all duration-300 ease-in-out backdrop-blur-lg bg-white/30 border border-white/20 rounded-xl"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <CardHeader className="relative bg-purple-600 text-white p-2 flex justify-center items-center rounded-t-xl">
        <h2 className="text-lg font-semibold">Chat about {item.name}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-2 right-2 hover:bg-purple-700 rounded-full p-1"
        >
          <X className="h-5 w-5 mb-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto p-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 ${
              message.sender_id === uuid ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                message.sender_id === uuid
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {message.content}
            </span>
          </div>
        ))}
      </CardContent>
      <CardFooter className="p-2">
        <form onSubmit={handleSendMessage} className="flex w-full">
          <Input
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow mr-2"
          />
          <Button type="submit">Send</Button>
        </form>
      </CardFooter>
    </Card>
  );
}
