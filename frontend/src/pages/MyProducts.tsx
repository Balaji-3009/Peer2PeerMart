
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Pencil, Trash2, ShoppingBag, Plus, ArrowLeft } from "lucide-react";
import EditProductDetails from "../components/EditProductDetails";
import Sidebar from "../components/Sidebar";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const idToken = localStorage.getItem("idToken");
  const uuid = localStorage.getItem("uuid");

  // Fetch products data from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${VITE_BACKEND_URL}/products/getMyProducts?user_id=${uuid}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        const data = await response.json();

        if (data.status === "success") {
          setProducts(data.data);
        } else {
          console.error("Failed to fetch products:", data.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [uuid, idToken]);

  // Remove product from the UI and backend
  const removeProduct = async (id) => {
    try {
      const response = await fetch(
        `${VITE_BACKEND_URL}/products/deleteProduct/?productId=${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      console.log(
        `${VITE_BACKEND_URL}/products/deleteProduct/?productId=${id}`
      );
      const data = await response.json();

      if (data.status === "success") {
        setProducts((items) => items.filter((item) => item.id !== id));
        alert("Product deleted successfully");
      } else {
        console.error("Failed to delete product");
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  };

  const openEditPopup = (product) => {
    setEditProduct(product);
  };

  // Handle product update
  const handleProductUpdated = (updatedProduct) => {
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setEditProduct(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex pt-24">
      <Sidebar />
      <div className="flex-1 p-8 animate-fade">
        <div className="w-full max-w-5xl mx-auto">
          <div className="glass rounded-2xl overflow-hidden shadow-xl mb-12">
            <div className="bg-purple-600 from-primary to-primary/80 text-white p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
                    My Store
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold">My Products</h1>
                </div>
                <Button
                  className="bg-white text-primary hover:bg-white/90 rounded-lg flex items-center gap-2 shadow-lg btn-hover-effect"
                  onClick={() => navigate("/create")}
                >
                  <Plus className="h-4 w-4" /> Add New Product
                </Button>
              </div>
            </div>

            <div className="p-8">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500 font-medium">Loading your products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16 animate-scale">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-medium text-gray-800 mb-3">
                    No products yet
                  </h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    You haven't added any products to your store. Start selling by
                    adding your first product.
                  </p>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg shadow-lg shadow-primary/20 btn-hover-effect"
                    onClick={() => navigate("/create")}
                  >
                    <Plus className="h-5 w-5 mr-2" /> Add Your First Product
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {products.map((product, index) => (
                    <div
                      key={product.id}
                      className="glass p-6 rounded-xl hover:shadow-xl transition-all duration-300 animate-slide-up"
                      style={{animationDelay: `${index * 0.05}s`}}
                    >
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="sm:w-48 h-48 rounded-xl overflow-hidden bg-white flex-shrink-0 shadow-sm">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain p-4"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://via.placeholder.com/150?text=No+Image";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                              <ShoppingBag className="h-10 w-10 text-gray-300" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {product.name}
                              </h3>
                              <div className="flex items-center gap-2 mb-4">
                                <span className="text-primary font-semibold text-xl">
                                  ₹{Number.parseFloat(product.price).toFixed(2)}
                                </span>
                                {product.negotiable && (
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                    Negotiable
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center space-x-3 sm:self-start">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-primary border-primary/20 hover:bg-primary/10 hover:border-primary/30 rounded-lg"
                                onClick={() => openEditPopup(product)}
                              >
                                <Pencil className="h-4 w-4 mr-2" /> Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 rounded-lg"
                                onClick={() => removeProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </Button>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {product.desc}
                          </p>

                          <div className="flex flex-wrap gap-2 text-sm">
                            {product.category && (
                              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                                {product.category}
                              </span>
                            )}
                            {product.stock !== undefined && (
                              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                                Stock: {product.stock}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-6 border-t border-gray-100">
              <Button
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/5 rounded-lg"
                onClick={() => navigate("/products")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to All Products
              </Button>
            </div>
          </div>
        </div>
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
  );
}
