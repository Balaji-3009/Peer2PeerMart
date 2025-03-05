"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Pencil, Trash2, ShoppingBag, Plus, ArrowLeft } from "lucide-react"
import EditProductDetails from "../components/EditProductDetails"
import Sidebar from "../components/Sidebar"

export default function MyProducts() {
  const [products, setProducts] = useState([])
  const [editProduct, setEditProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const idToken = localStorage.getItem("idToken")
  const uuid = localStorage.getItem("uuid")

  // Fetch products data from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`https://peer2peermart.onrender.com/products/getMyProducts?user_id=${uuid}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        })

        const data = await response.json()

        if (data.status === "success") {
          setProducts(data.data)
        } else {
          console.error("Failed to fetch products:", data.message)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [uuid, idToken])

  // Remove product from the UI and backend
  const removeProduct = async (id) => {
    try {
      const response = await fetch(`https://peer2peermart.onrender.com/products/deleteProduct/?productId=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      })

      const data = await response.json()

      if (data.status === "success") {
        setProducts((items) => items.filter((item) => item.id !== id))
        alert("Product deleted successfully")
      } else {
        console.error("Failed to delete product")
        alert("Failed to delete product")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Error deleting product")
    }
  }

  const openEditPopup = (product) => {
    setEditProduct(product)
  }

  // Handle product update
  const handleProductUpdated = (updatedProduct) => {
    setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
    setEditProduct(null)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex mt-10">
      <Sidebar />
      <div className="flex-1 p-6">
        <Card className="w-full max-w-5xl mx-auto shadow-md">
          <CardHeader className="bg-purple-600 text-white p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold">My Products</h1>
            <Button
              className="bg-white text-purple-600 hover:bg-gray-100 flex items-center gap-2"
              onClick={() => navigate("/create")}
            >
              <Plus className="h-4 w-4" /> Add New Product
            </Button>
          </CardHeader>

          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No products yet</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  You haven't added any products to your store. Start selling by adding your first product.
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => navigate("/create")}>
                  <Plus className="h-4 w-4 mr-2" /> Add Your First Product
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row gap-6 p-4 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50/30 transition-colors"
                  >
                    <div className="sm:w-48 sm:h-48 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {product.image ? (
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "https://via.placeholder.com/150?text=No+Image"
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <ShoppingBag className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-1">{product.name}</h3>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-purple-600 font-medium text-lg">
                              ${Number.parseFloat(product.price).toFixed(2)}
                            </span>
                            {product.negotiable && (
                              <span className="text-xs bg-purple-50 text-purple-600 border border-purple-200 px-2 py-0.5 rounded-full">
                                Negotiable
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 sm:self-start">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-purple-600 border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                            onClick={() => openEditPopup(product)}
                          >
                            <Pencil className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                            onClick={() => removeProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-3 line-clamp-3">{product.desc}</p>

                      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        {product.category && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{product.category}</span>
                        )}
                        {product.stock !== undefined && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            Stock: {product.stock}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          <CardFooter className="bg-gray-50 p-6 flex justify-between items-center border-t">
            <Button
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50"
              onClick={() => navigate("/products")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to All Products
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Edit Product Popup */}
      {editProduct && (
        <EditProductDetails
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onUpdate={handleProductUpdated}
        />
      )}
    </div>
  )
}

