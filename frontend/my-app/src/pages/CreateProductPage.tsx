"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Switch } from "../components/ui/switch"
import { Slider } from "../components/ui/slider"
import { Upload } from "lucide-react"
import Sidebar from "../components/Sidebar"

export default function CreateProductPage() {
  const navigate = useNavigate()
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    negotiable: false,
    condition: 5,
    description: "",
    image: null,
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProductData((prev) => ({ ...prev, image: file }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Submitting product data:", productData)
    // Navigate to all products page after submission
    navigate("/products")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 p-10">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <h1 className="text-3xl font-bold text-center text-purple-600">Create New Product</h1>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" value={productData.name} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={productData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="negotiable"
                  name="negotiable"
                  checked={productData.negotiable}
                  onCheckedChange={(checked) => setProductData((prev) => ({ ...prev, negotiable: checked }))}
                />
                <Label htmlFor="negotiable">Price Negotiable</Label>
              </div>

              <div className="space-y-2">
                <Label>Condition Rating</Label>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[productData.condition]}
                  onValueChange={(value) => setProductData((prev) => ({ ...prev, condition: value[0] }))}
                />
                <div className="text-center">{productData.condition} / 10</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={productData.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Product Image</Label>
                <div className="flex items-center space-x-2">
                  <Input id="image" name="image" type="file" onChange={handleImageUpload} className="hidden" />
                  <Button type="button" variant="outline" onClick={() => document.getElementById("image").click()}>
                    <Upload className="mr-2 h-4 w-4" /> Upload Image
                  </Button>
                  {productData.image && <span className="text-sm text-gray-500">{productData.image.name}</span>}
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate("/products")}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              Create Product
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

