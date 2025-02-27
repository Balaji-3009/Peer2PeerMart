"use client";

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
import { Switch } from "../components/ui/switch";
import { Slider } from "../components/ui/slider";
import { Upload } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function CreateProductPage() {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    negotiable: false,
    condition: 5,
    description: "",
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting product data:", productData);
    navigate("/products");
  };

  return (
    <div className="min-h-screen flex bg-white-100">
      <Sidebar />
      <div className="flex-1 p-10">
        <Card className="w-full max-w-2xl mx-auto shadow-lg border border-violet-300">
          <CardHeader className="bg-violet-600 text-white rounded-t-lg p-6">
            <h1 className="text-3xl font-bold text-center">
              Create New Product
            </h1>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-violet-700">
                  Product Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={productData.name}
                  onChange={handleInputChange}
                  required
                  className="border-violet-400 focus:ring-violet-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-violet-700">
                  Price
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={productData.price}
                  onChange={handleInputChange}
                  required
                  className="border-violet-400 focus:ring-violet-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="negotiable"
                  name="negotiable"
                  checked={productData.negotiable}
                  onCheckedChange={(checked) =>
                    setProductData((prev) => ({ ...prev, negotiable: checked }))
                  }
                  className="border border-violet-500 focus:ring-violet-500 data-[state=checked]:bg-violet-700 data-[state=unchecked]:bg-gray-300 rounded-full w-12 h-6 relative"
                >
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transform transition-transform duration-300 data-[state=checked]:translate-x-6"></div>
                </Switch>
                <Label
                  htmlFor="negotiable"
                  className="text-violet-700 font-semibold"
                >
                  Price Negotiable
                </Label>
              </div>

              <div className="space-y-2">
                <Label className="text-violet-700 font-semibold">
                  Condition Rating
                </Label>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[productData.condition]}
                  onValueChange={(value) =>
                    setProductData((prev) => ({ ...prev, condition: value[0] }))
                  }
                  className="w-full"
                >
                  <div className="h-2 bg-violet-300 rounded-md relative">
                    <div
                      className="h-2 bg-violet-700 rounded-md"
                      style={{
                        width: `${(productData.condition / 10) * 100}%`,
                      }}
                    ></div>
                    <div
                      className="w-5 h-5 bg-violet-700 rounded-full absolute top-1/2 -translate-y-1/2"
                      style={{ left: `${(productData.condition / 10) * 100}%` }}
                    ></div>
                  </div>
                </Slider>
                <div className="text-center font-semibold text-violet-700">
                  {productData.condition} / 10
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-violet-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={productData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="border-violet-400 focus:ring-violet-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-violet-700">
                  Product Image
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image").click()}
                    className="border-violet-600 text-violet-600 hover:bg-violet-100"
                  >
                    <Upload className="mr-2 h-4 w-4" /> Upload Image
                  </Button>
                  {productData.image && (
                    <span className="text-sm text-gray-600">
                      {productData.image.name}
                    </span>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between bg-violet-50 p-4 rounded-b-lg">
            <Button
              variant="outline"
              onClick={() => navigate("/products")}
              className="border-violet-600 text-violet-600 hover:bg-violet-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              Create Product
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
