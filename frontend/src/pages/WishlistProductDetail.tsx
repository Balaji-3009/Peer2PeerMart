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

export default function WishlistWishlistProductDetailPage() {
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
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 relative pt-24">
      <Sidebar />
      <ToastContainer position="top-right" autoClose={3000} />

      <Card className="w-full max-w-4xl overflow-hidden shadow-lg">
        <CardHeader className="p-0">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-[50vh] object-contain bg-white p-4"
          />
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-4">
            <h1 className="text-4xl font-extrabold text-violet-700 mb-2">
              {product.name}
            </h1>
            <p className="text-lg text-gray-700 font-serif">
              {product.longDescription}
            </p>
          </div>
          <p className="text-2xl font-bold text-purple-600 mb-4">
            &#8377;{product.price.toFixed(2)}
          </p>

          {product.specs.length > 0 && (
            <>
              <h2 className="text-xl font-semibold text-violet-700 mb-2">
                Specifications:
              </h2>
              <ul className="list-disc pl-5 mb-6">
                {product.specs.map((spec, index) => (
                  <li key={index} className="text-gray-600">
                    {spec}
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
        <CardFooter className="bg-gray-50 p-6 flex flex-wrap gap-4">
          <Button
            className="bg-violet-700 hover:bg-violet-800 text-white font-semibold px-6 py-2"
            onClick={handleAddToWishlist}
            disabled={wishlistAdded}
          >
            {wishlistAdded ? "Added to Wishlist" : "Add to Wishlist"}
          </Button>
          <Button
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-100 font-semibold px-6 py-2"
            onClick={() => setIsReportModalOpen(true)}
          >
            Report Seller
          </Button>
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-gray-900 px-6 py-2"
            onClick={() => navigate("/products")}
          >
            Back to Products
          </Button>
        </CardFooter>
      </Card>

      <ReportSellerModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}
