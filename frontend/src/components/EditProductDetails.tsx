"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"

export default function EditProductDetails({ product, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    category: "",
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        description: product.description,
        stock: product.stock.toString(),
        category: product.category,
      })
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically update the product in your database
    console.log("Updated product:", formData)
    onClose()
  }

  // Close when clicking outside the card
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-xl border border-gray-200 animate-in fade-in duration-200">
        <CardHeader className="bg-purple-600 text-white p-4 flex flex-row justify-between items-center rounded-t-lg">
          <h3 className="font-semibold text-lg">Edit Product Details</h3>
          <Button variant="ghost" size="icon" className="text-white hover:bg-purple-700 rounded-full" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-white/80 border-gray-300 focus:border-purple-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
                className="bg-white/80 border-gray-300 focus:border-purple-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="bg-white/80 border-gray-300 focus:border-purple-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                required
                className="bg-white/80 border-gray-300 focus:border-purple-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="bg-white/80 border-gray-300 focus:border-purple-400"
              />
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50/80 p-4 flex justify-end space-x-3 rounded-b-lg">
            <Button type="button" variant="outline" className="border-gray-300 hover:bg-gray-100/80" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

