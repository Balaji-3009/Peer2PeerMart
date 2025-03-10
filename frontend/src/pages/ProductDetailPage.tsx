import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Heart } from "lucide-react";
import { Toaster, toast } from "sonner";
import Sidebar from "../components/Sidebar";
import ReportSellerModal from "../components/ReportSellerModal";

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
          `https://peer2peermart.onrender.com/products/getProduct/${id}`,
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
    if (wishlistAdded) return; // Prevent multiple clicks

    try {
      const idToken = localStorage.getItem("idToken");
      const userId = localStorage.getItem("uuid"); // Assuming 'uuid' is stored in localStorage

      if (!userId) {
        toast.error("User ID not found. Please log in again.");
        return;
      }

      const response = await fetch(
        `https://peer2peermart.onrender.com/transactions/createTransactions`,
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
        toast.success("Added to wishlist!", { duration: 3000 });
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
    toast.success("Seller reported successfully", { duration: 3000 });
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 relative  pt-24">
      <Sidebar />
      <Toaster position="top-right" offset={50} />

      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="ghost"
          className="relative"
          onClick={handleAddToWishlist}
          disabled={wishlistAdded}
        >
          <Heart
            className={`h-6 w-6 ${
              wishlistAdded ? "text-red-500" : "text-purple-600"
            }`}
          />
        </Button>
      </div>

      <Card className="w-full max-w-4xl overflow-hidden">
        <CardHeader className="p-0">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-[50vh] object-contain"
          />
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-2xl font-bold text-purple-600">
              &#8377;{product.price.toFixed(2)}
            </p>
          </div>
          <p className="text-2xl text-gray-600 mb-6  text-purple-600">
            {product.user_name}
          </p>
          <p className="text-gray-600 mb-6">{product.longDescription}</p>
          {product.specs.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-2">Specifications:</h2>
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
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={handleAddToWishlist}
            disabled={wishlistAdded}
          >
            {wishlistAdded ? "Added to Wishlist" : "Add to Wishlist"}
          </Button>
          <Button
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-100"
            onClick={() => setIsReportModalOpen(true)}
          >
            Report Seller
          </Button>
          <Button
            variant="ghost"
            className="text-gray-600"
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
