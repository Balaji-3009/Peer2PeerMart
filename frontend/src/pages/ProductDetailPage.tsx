import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "../components/Sidebar";
import ReportSellerModal from "../components/ReportSellerModal";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const idToken = localStorage.getItem("idToken");
        const response = await fetch(
          `${VITE_BACKEND_URL}/products/getProduct/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          }
        );
        const data = await response.json();
        if (data.status === "success") {
          setProduct({
            id: data.data.id,
            name: data.data.name,
            user_name: data.data.user_name,
            description: data.data.desc || "No description available",
            price: parseFloat(data.data.price) || 0,
            imageUrl: data.data.image,
            longDescription: data.data.desc || "No description available",
            specs: data.data.specs || [],
          });
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToWishlist = async () => {
    if (wishlistAdded) return;

    try {
      const idToken = localStorage.getItem("idToken");
      const userId = localStorage.getItem("uuid");

      if (!userId) {
        toast.error("User ID not found. Please log in again.");
        return;
      }

      const response = await fetch(
        `${VITE_BACKEND_URL}/transactions/createTransactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            user_id: userId,
            product_id: product.id,
            price: product.price.toString(),
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setWishlistAdded(true);
        toast.dismiss();
        toast.success("Added to wishlist!");
      } else {
        toast.error(data.message || "Failed to add to wishlist.");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleReportSubmit = (reason) => {
    console.log("Reporting seller with reason:", reason);
    toast.success("Seller reported successfully");
    setIsReportModalOpen(false);
    navigate("/products");
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col items-center p-6 relative pt-24">
      <Sidebar />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-5xl mx-auto animate-fade">
        <div className="mb-8 animate-slide">
          <Button
            variant="ghost"
            className="text-gray-500 hover:text-primary hover:bg-primary/5 transition-colors mb-6"
            onClick={() => navigate("/products")}
          >
            ← Back to Products
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="animate-scale">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full aspect-square object-contain p-8"
              />
            </div>
          </div>

          <div
            className="flex flex-col animate-slide"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="mb-2">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                {product.user_name
                  ? `Sold by ${product.user_name}`
                  : "For Sale"}
              </div>
              <h1 className="text-4xl font-bold text-gray-800 tracking-tight mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-primary mb-6">
                ₹{product.price.toFixed(2)}
              </p>
            </div>

            <div className="glass p-6 rounded-xl mb-8">
              <h2 className="text-lg font-medium text-gray-800 mb-3">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {product.longDescription}
              </p>
            </div>

            {product.specs.length > 0 && (
              <div className="glass p-6 rounded-xl mb-8">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  Specifications
                </h2>
                <ul className="space-y-2">
                  {product.specs.map((spec, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                      <span className="text-gray-600">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-auto space-y-4">
              <Button
                className={`w-full py-6 rounded-xl text-base font-medium transition-all duration-300 ${
                  wishlistAdded
                    ? "bg-green-50 text-green-600 border border-green-200"
                    : "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                }`}
                onClick={handleAddToWishlist}
                disabled={wishlistAdded}
              >
                {wishlistAdded ? "Added to Wishlist ✓" : "Add to Wishlist"}
              </Button>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 py-4 border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-medium"
                  onClick={() => setIsReportModalOpen(true)}
                >
                  Report Seller
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReportSellerModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        productId={product.id} // Pass the product ID directly
      />
    </div>
  );
}
