import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Upload, ArrowLeft, ImagePlus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useToast } from "@/hooks/use-toast";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function CreateProductPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    negotiable: false,
    condition: 5,
    description: "",
    image: null,
    imageUrl: "", // Store uploaded image URL
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast({
        title: "Error",
        description: "No file selected.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ""
    );

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ""
    }/image/upload`;

    try {
      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Cloudinary Error:", data);
        throw new Error(data.error?.message || "Image upload failed");
      }

      setProductData((prev) => ({
        ...prev,
        image: file,
        imageUrl: data.secure_url,
      }));

      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });
    } catch (error) {
      console.error("Error uploading image:", error.message);
      toast({
        title: "Error",
        description: `Failed to upload image: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uuid = localStorage.getItem("uuid");
    const idToken = localStorage.getItem("idToken");

    if (!uuid || !idToken) {
      toast({
        title: "Error",
        description: "User not authenticated.",
        variant: "destructive",
      });
      return;
    }

    const productDetails = {
      name: productData.name,
      user_id: uuid,
      price: productData.price,
      desc: productData.description,
      image: productData.imageUrl, // Use secure URL from Cloudinary
      negotiable: productData.negotiable ? 1 : 0, // Convert boolean to 1 or 0
    };

    try {
      const response = await fetch(
        `${VITE_BACKEND_URL}/products/createProducts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify(productDetails),
        }
      );

      const responseData = await response.json();
      console.log("Product creation response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to create product");
      }

      toast({
        title: "Success",
        description: "Product created successfully!",
      });
      navigate("/myproducts");
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-white to-violet-50 pt-24">
      <Sidebar />
      <div className="flex-1 p-6 md:p-10 animate-fade-in">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-violet-200 overflow-hidden transition-all duration-300 hover:shadow-violet-200/50">
            <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-700 text-white p-6">
              <h1 className="text-3xl font-bold">Create New Product</h1>
              <p className="text-violet-100 mt-2">
                Add a new item to your store
              </p>
            </CardHeader>

            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-violet-800 font-medium">
                    Product Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={productData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter product name"
                    className="border-violet-200 focus-visible:ring-violet-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="price"
                    className="text-violet-800 font-medium"
                  >
                    Price (₹)
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={productData.price}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter price"
                    className="border-violet-200 focus-visible:ring-violet-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="negotiable"
                    name="negotiable"
                    checked={productData.negotiable}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-violet-600 border-violet-300 rounded focus:ring-violet-500"
                  />
                  <Label
                    htmlFor="negotiable"
                    className="text-violet-800 font-medium cursor-pointer"
                  >
                    Price Negotiable
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-violet-800 font-medium"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={productData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe your product in detail..."
                    className="border-violet-200 focus-visible:ring-violet-500"
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="image"
                    className="text-violet-800 font-medium"
                  >
                    Product Image
                  </Label>

                  {productData.imageUrl ? (
                    <div className="mt-2 relative">
                      <div className="relative rounded-lg overflow-hidden border border-violet-200 w-full h-48 bg-white">
                        <img
                          src={productData.imageUrl}
                          alt="Product preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("image").click()}
                        className="mt-2 border-violet-400 text-violet-700 hover:bg-violet-50"
                      >
                        <Upload className="mr-2 h-4 w-4" /> Change Image
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-violet-200 rounded-lg p-8 text-center hover:bg-violet-50/50 transition-colors">
                      <Input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => document.getElementById("image").click()}
                        className="w-full h-full flex flex-col items-center justify-center text-violet-500 hover:text-violet-700 hover:bg-transparent"
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <ImagePlus className="h-12 w-12 mb-3 text-violet-400" />
                            <span className="font-medium">
                              Click to upload image
                            </span>
                            <span className="text-sm text-violet-400 mt-1">
                              JPG, PNG or GIF (max. 5MB)
                            </span>
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </form>
            </CardContent>

            <CardFooter className="bg-violet-50 p-6 flex flex-col sm:flex-row justify-end gap-3 border-t border-violet-100">
              <Button
                variant="outline"
                onClick={() => navigate("/myproducts")}
                className="w-full sm:w-auto border-violet-500 text-violet-700 hover:bg-violet-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white"
                disabled={isUploading}
              >
                Create Product
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
