"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const productsData = [
  {
    id: 1,
    name: "Smartphone X",
    description: "Latest model with advanced features",
    price: 799.99,
  },
  {
    id: 2,
    name: "Laptop Pro",
    description: "High-performance laptop for professionals",
    price: 1299.99,
  },
  {
    id: 3,
    name: "Wireless Earbuds",
    description: "True wireless earbuds with noise cancellation",
    price: 149.99,
  },
  {
    id: 4,
    name: "Smart Watch",
    description: "Fitness tracker and smartwatch in one",
    price: 249.99,
  },
  {
    id: 5,
    name: "4K TV",
    description: "Ultra HD smart TV with HDR",
    price: 799.99,
  },
];

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState(productsData);
  const navigate = useNavigate();

  const handleSearch = (term: string) => {
    const filteredProducts = productsData.filter(
      (product) =>
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.description.toLowerCase().includes(term.toLowerCase())
    );
    setProducts(filteredProducts);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Product Search */}
      <div className="space-y-8 w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Best Finds on Campus
        </h1>
        <div className="flex justify-center">
          <div className="relative w-full max-w-xl">
            <Input
              type="text"
              placeholder="Search for amazing products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value); // Live search
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch(searchTerm); // Search on Enter
              }}
              className="pr-10 rounded-full"
            />
            <Button
              onClick={() => handleSearch(searchTerm)}
              className="absolute right-0 top-0 bottom-0 rounded-full"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden transform transition-all hover:scale-105"
            >
              <CardHeader className="p-0">
                <div className="h-48 bg-gray-200"></div>
              </CardHeader>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-600">{product.description}</p>
              </CardContent>
              <CardFooter className="bg-gray-50 p-4 flex justify-between items-center">
                <p className="text-lg font-bold text-purple-600">
                  ${product.price.toFixed(2)}
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
