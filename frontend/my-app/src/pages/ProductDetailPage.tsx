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

// Dummy product details (you would typically fetch this from an API)
const dummyProductDetails = {
  id: 1,
  name: "Smartphone X",
  description: "Latest model with advanced features",
  price: 799.99,
  imageUrl: img,
  longDescription:
    "Experience the future of mobile technology with Smartphone X. Featuring a stunning 6.7-inch OLED display, 5G capabilities, and an AI-powered camera system, this device sets a new standard for smartphones. With its sleek design and powerful performance, Smartphone X is perfect for both work and play.",
  specs: [
    "6.7-inch OLED display",
    "5G capable",
    "Triple-lens camera system",
    "256GB storage",
    "All-day battery life",
  ],
};

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(dummyProductDetails);
  const [wishlistItems, setWishlistItems] = useState(0);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    setProduct({ ...dummyProductDetails, id: Number(id) });
  }, [id]);

  const handleAddToWishlist = () => {
    setWishlistItems((prevItems) => prevItems + 1);
    toast.success("Added to wishlist!", { duration: 3000 });
  };

  const handleReportSubmit = (reason) => {
    // Here you would typically send the report to your backend
    console.log("Reporting seller with reason:", reason);
    toast.success("Seller reported successfully", { duration: 3000 });
    setIsReportModalOpen(false);
    navigate("/products");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 relative">
      <Sidebar />
      <Toaster position="top-right" offset={50} />

      {/* Wishlist Icon */}
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

      <Card className="w-full max-w-4xl overflow-hidden">
        <CardHeader className="p-0">
          <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-2xl font-bold text-purple-600">
              ${product.price.toFixed(2)}
            </p>
          </div>
          <p className="text-gray-600 mb-6">{product.longDescription}</p>
          <h2 className="text-xl font-semibold mb-2">Specifications:</h2>
          <ul className="list-disc pl-5 mb-6">
            {product.specs.map((spec, index) => (
              <li key={index} className="text-gray-600">
                {spec}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="bg-gray-50 p-6 flex flex-wrap gap-4">
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