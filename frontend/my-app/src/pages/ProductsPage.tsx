"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Search } from "lucide-react"
import Sidebar from "../components/Sidebar"

const productsData = [
  { 
    id: 1,
    name: "Vintage Camera",
    description: "Capture memories with this classic vintage camera.",
    imageUrl: "https://via.placeholder.com/150",
    price: 79.99,
  },
  {
    id: 2,
    name: "Leather Journal",
    description: "Write down your thoughts in this elegant leather journal.",
    imageUrl: "https://via.placeholder.com/150",
    price: 49.99,
  },
  {
    id: 3,
    name: "Retro Sunglasses",
    description: "Stay stylish with these cool retro sunglasses.",
    imageUrl: "https://via.placeholder.com/150",
    price: 29.99,
  },
  {
    id: 4,
    name: "Portable Bluetooth Speaker",
    description: "Enjoy your favorite music on the go with this portable speaker.",
    imageUrl: "https://via.placeholder.com/150",
    price: 39.99,
  },
  {
    id: 5,
    name: "Ceramic Coffee Mug",
    description: "Start your day right with this unique ceramic coffee mug.",
    imageUrl: "https://via.placeholder.com/150",
    price: 19.99,
  },
  {
    id: 6,
    name: "Desk Organizer",
    description: "Keep your workspace tidy with this practical desk organizer.",
    imageUrl: "https://via.placeholder.com/150",
    price: 24.99,
  },
]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState(productsData)
  const navigate = useNavigate()

  const handleSearch = (term: string) => {
    const filteredProducts = productsData.filter((product) => product.name.toLowerCase().includes(term.toLowerCase()))
    setProducts(filteredProducts)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex ">
      <Sidebar />
      <div className="flex-1 p-6 ml-16">
        {" "}
        {/* Add ml-16 to account for the collapsed sidebar width */}
        <div className="space-y-8 w-full max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-800">Best Finds on Campus</h1>
          <div className="flex justify-center">
            <div className="relative w-full max-w-xl">
              <Input
                type="text"
                placeholder="Search for amazing products..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  handleSearch(e.target.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch(searchTerm)
                }}
                className="pr-10 rounded-full"
              />
              <Button onClick={() => handleSearch(searchTerm)} className="absolute right-0 top-0 bottom-0 rounded-full">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                </CardHeader>
                <CardContent>
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <p className="text-sm text-gray-600">{product.description}</p>
                </CardContent>
                <CardFooter className="justify-between items-center">
                  <span className="text-base font-medium">${product.price.toFixed(2)}</span>
                  <Button size="sm" onClick={() => navigate(`/products/${product.id}`)}>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

