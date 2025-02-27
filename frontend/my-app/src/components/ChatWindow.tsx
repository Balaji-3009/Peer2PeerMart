"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { X } from "lucide-react"

export default function ChatWindow({ item, onClose, position }) {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")

  useEffect(() => {
    setMessages([])
  }, [])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, sender: "user" }])
      setMessages((prevMessages) => [...prevMessages, { text: "Hi", sender: "bot" }])
      setInputMessage("")
    }
  }

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
          className="absolute top-2 right-2 hover:bg-purple-700 rounded-full p-1 "
        >
          <X className="h-5 w-5 mb-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto p-2">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.sender === "user" ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block p-2 rounded-lg ${
                message.sender === "user" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              {message.text}
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
  )
}
  