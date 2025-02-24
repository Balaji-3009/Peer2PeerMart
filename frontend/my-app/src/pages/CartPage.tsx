"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Trash2, MinusCircle, PlusCircle } from "lucide-react"

// Dummy cart data
const initialCartItems = [
  { id: 1, name: "Smartphone X", price: 799.99, quantity: 1 },
  { id: 2, name: "Laptop Pro", price: 1299.99, quantity: 1 },
  { id: 3, name: "Wireless Earbuds", price: 149.99, quantity: 2 },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const navigate = useNavigate()

  const updateQuantity = (id: number, change: number) => {
    setCartItems((items) =>
      items
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <Card className="w-full max-w-4xl overflow-hidden">
        <CardHeader className="bg-purple-600 text-white p-6">
          <h1 className="text-3xl font-bold">Your Cart</h1>
        </CardHeader>
        <CardContent className="p-6">
          {cartItems.length === 0 ? (
            <p className="text-gray-600 text-center">Your cart is empty.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item.id} className="py-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, -1)}>
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <span className="text-gray-800 font-medium">{item.quantity}</span>
                      <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, 1)}>
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
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
        <CardFooter className="bg-gray-50 p-6 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-2xl font-bold text-purple-600 mb-4 sm:mb-0">Total: ${total.toFixed(2)}</div>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-100"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => alert("Proceeding to checkout...")}
            >
              Proceed to Checkout
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

