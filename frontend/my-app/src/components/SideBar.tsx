"use client"

import { useState } from "react"
import { Package, ShoppingCart, Heart, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "./ui/button"

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen)

  const menuItems = [
    { icon: <Package className="h-5 w-5" />, label: "Create Product", href: "#" },
    { icon: <ShoppingCart className="h-5 w-5" />, label: "Received Orders", href: "#" },
    { icon: <Heart className="h-5 w-5" />, label: "Wishlist", href: "#" },
  ]

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all z-10 duration-300 ease-in-out ${isOpen ? "w-64" : "w-16"}`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-4 bg-purple-600 text-white rounded-full p-1 hover:bg-purple-700"
        onClick={toggleSidebar}
      >
        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
      <div className="flex flex-col items-center pt-16">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className={`flex items-center w-full p-4 text-gray-700 hover:bg-purple-100 transition-colors ${
              isOpen ? "justify-start space-x-4" : "justify-center"
            }`}
          >
            {item.icon}
            {isOpen && <span className="font-medium">{item.label}</span>}
          </a>
        ))}
      </div>
    </div>
  )
}

export default Sidebar

