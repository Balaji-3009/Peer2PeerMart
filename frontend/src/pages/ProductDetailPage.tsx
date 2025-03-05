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
import img from "../assets/placeholder.png";

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const [product, setProduct] = useState(null);
  const [wishlistItems, setWishlistItems] = useState(0);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const idToken = localStorage.getItem("idToken");
        const response = await fetch(
          `https://peer2peermart.onrender.com/products/getProduct/${productId}`,
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
            description: data.data.desc || "No description available",
            price: parseFloat(data.data.price) || 0,
            imageUrl: img,
          });
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToWishlist = () => {
    setWishlistItems((prevItems) => prevItems + 1);
    toast.success("Added to wishlist!", { duration: 3000 });
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 relative">
      <Sidebar />
      <Toaster position="top-right" offset={50} />

      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="ghost"
          className="relative"
          onClick={() => navigate("/wishlist")}
        >
          <Heart className="h-6 w-6 text-purple-600" />
          {wishlistItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {wishlistItems}
            </span>
          )}
        </Button>
      </div>

      <Card className="w-full max-w-2xl text-center">
        <CardHeader className="p-0">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
        </CardHeader>
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {product.name}
          </h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <p className="text-2xl font-bold text-purple-600">
            ${product.price.toFixed(2)}
          </p>
        </CardContent>
        <CardFooter className="bg-gray-50 p-6 flex flex-wrap gap-4 justify-center">
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={handleAddToWishlist}
          >
            Add to Wishlist
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
