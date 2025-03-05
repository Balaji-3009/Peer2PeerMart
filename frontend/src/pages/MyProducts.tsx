"use client"

import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Pencil, Trash2, ShoppingBag } from "lucide-react"
import EditProductDetails from "../components/EditProductDetails"
import Sidebar from "../components/Sidebar"

// Dummy products data
const initialProducts = [
  {
    id: 1,
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    description: "Soft, eco-friendly cotton t-shirt available in multiple colors.",
    stock: 45,
    category: "Clothing",
  },
  {
    id: 2,
    name: "Handcrafted Ceramic Mug",
    price: 18.5,
    description: "Unique handmade ceramic mug, perfect for your morning coffee.",
    stock: 23,
    category: "Home Goods",
  },
  {
    id: 3,
    name: "Natural Beeswax Candle",
    price: 12.99,
    description: "100% pure beeswax candle with a subtle honey scent.",
    stock: 67,
    category: "Home Decor",
  },
  {
    id: 4,
    name: "Handwoven Basket",
    price: 34.99,
    description: "Traditional handwoven basket made from sustainable materials.",
    stock: 15,
    category: "Home Goods",
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts)
  const [editProduct, setEditProduct] = useState(null)
  const navigate = useNavigate()
  const editButtonRefs = useRef({})

  const removeProduct = (id) => {
    setProducts((items) => items.filter((item) => item.id !== id))
  }

  const openEditPopup = (product) => {
    setEditProduct(product)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 relative">
      <Sidebar />
      <Card className="w-full max-w-4xl overflow-hidden">
        <CardHeader className="bg-purple-600 text-white p-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Products</h1>
          <Button className="bg-white text-purple-600 hover:bg-gray-100" onClick={() => navigate("/create")}>
            Add New Product
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          {products.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">You haven't added any products yet.</p>
              <Button
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => navigate("/add-product")}
              >
                Add Your First Product
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {products.map((product) => (
                <li key={product.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-purple-600 font-medium">${product.price.toFixed(2)}</p>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
                    <div className="flex gap-4 mt-1 text-sm text-gray-500">
                      <span>Stock: {product.stock}</span>
                      <span>Category: {product.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-purple-600 hover:text-purple-700"
                      onClick={() => openEditPopup(product)}
                      ref={(el) => (editButtonRefs.current[product.id] = el)}
                    >
                      <Pencil className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeProduct(product.id)}
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
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </CardFooter>
      </Card>

      {/* Edit Product Popup */}
      {editProduct && <EditProductDetails product={editProduct} onClose={() => setEditProduct(null)} />}
    </div>
  )
}

