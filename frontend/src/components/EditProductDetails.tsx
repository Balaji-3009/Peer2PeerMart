"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function EditProductDetails({ product, onClose, onUpdate }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    desc: "",
    image: "",
    negotiable: 0,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price ? product.price.toString() : "",
        desc: product.desc || "",
        image: product.image || "",
        negotiable: product.negotiable ? 1 : 0,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "negotiable" ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const idToken = localStorage.getItem("idToken");

      const response = await fetch(
        `${VITE_BACKEND_URL}/products/updateProduct?productId=${product.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            name: formData.name,
            user_id: product.user_id,
            price: formData.price,
            desc: formData.desc,
            image: formData.image,
            negotiable: formData.negotiable,
          }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        onUpdate({
          ...product,
          ...formData,
        });
        alert("Product updated successfully");
      } else {
        alert(data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md bg-white shadow-xl border border-gray-200 animate-in fade-in duration-200">
        <CardHeader className="bg-purple-600 text-white p-4 flex flex-row justify-between items-center">
          <h3 className="font-semibold text-lg">Edit Product Details</h3>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-purple-700 rounded-full"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="p-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="negotiable"
                name="negotiable"
                checked={formData.negotiable === 1}
                onChange={handleChange}
              />
              <Label htmlFor="negotiable" className="cursor-pointer">
                Price is negotiable
              </Label>
            </div>
          </CardContent>

          <CardFooter className="bg-gray-50 p-4 flex justify-end space-x-3 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
