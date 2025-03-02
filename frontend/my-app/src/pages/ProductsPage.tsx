"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Filter, Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import img from "../assets/placeholder.png";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Slider } from "../components/ui/slider";
import { Label } from "../components/ui/label";

const productsData = [
  {
    id: 1,
    name: "Vintage Camera",
    description: "Capture memories with this classic vintage camera.",
    imageUrl: img,
    price: 79.99,
  },
  {
    id: 2,
    name: "Leather Journal",
    description: "Write down your thoughts in this elegant leather journal.",
    imageUrl: img,
    price: 49.99,
  },
  {
    id: 3,
    name: "Retro Sunglasses",
    description: "Stay stylish with these cool retro sunglasses.",
    imageUrl: img,
    price: 29.99,
  },
  {
    id: 4,
    name: "Portable Bluetooth Speaker",
    description:
      "Enjoy your favorite music on the go with this portable speaker.",
    imageUrl: img,
    price: 39.99,
  },
  {
    id: 5,
    name: "Ceramic Coffee Mug",
    description: "Start your day right with this unique ceramic coffee mug.",
    imageUrl: img,
    price: 19.99,
  },
  {
    id: 6,
    name: "Desk Organizer",
    description: "Keep your workspace tidy with this practical desk organizer.",
    imageUrl: img,
    price: 24.99,
  },
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState(productsData);
  const navigate = useNavigate();

  // Price filter statea
  const [priceRange, setPriceRange] = useState([0, 100]);

  const handleSearch = (term: string) => {
    filterProducts(term, priceRange);
  };

  const handlePriceFilter = (range: number[]) => {
    setPriceRange(range);
    filterProducts(searchTerm, range);
  };

  const filterProducts = (term: string, range: number[]) => {
    const filtered = productsData.filter(
      (product) =>
        product.name.toLowerCase().includes(term.toLowerCase()) &&
        product.price >= range[0] &&
        product.price <= range[1]
    );
    setProducts(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex ">
      <Sidebar />
      <div className="flex-1 p-6 ml-16">
        <div className="space-y-8 w-full max-w-4xl mx-auto">
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
                  handleSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch(searchTerm);
                }}
                className="pr-20 rounded-full"
              />
              <div className="absolute right-0 top-0 bottom-0 flex">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-full px-3 rounded-full"
                    >
                      <Filter className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-white shadow-lg rounded-lg p-4 border border-gray-300">
                    <div className="space-y-4">
                      <h4 className="font-medium">Filter by Price</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>${priceRange[0]}</span>
                          <span>${priceRange[1]}</span>
                        </div>
                        <Slider
                          defaultValue={[0, 100]}
                          max={100}
                          step={1}
                          value={priceRange}
                          onValueChange={handlePriceFilter}
                          className="my-4"
                        />
                        <div className="flex gap-4">
                          <div className="grid gap-2 flex-1">
                            <Label htmlFor="min-price">Min Price</Label>
                            <Input
                              id="min-price"
                              type="number"
                              value={priceRange[0] === 0 ? "" : priceRange[0]} // Show empty string when value is 0
                              onChange={(e) => {
                                const value =
                                  e.target.value === ""
                                    ? 0
                                    : Number(e.target.value); // Handle empty input
                                handlePriceFilter([value, priceRange[1]]);
                              }}
                            />
                          </div>
                          <div className="grid gap-2 flex-1">
                            <Label htmlFor="max-price">Max Price</Label>
                            <Input
                              id="max-price"
                              type="number"
                              value={priceRange[1] === 100 ? "" : priceRange[1]}
                              onChange={(e) => {
                                const value =
                                  e.target.value === ""
                                    ? 100
                                    : Number(e.target.value);
                                handlePriceFilter([priceRange[0], value]);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button
                  onClick={() => handleSearch(searchTerm)}
                  className="rounded-full"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                </CardHeader>
                <CardContent>
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <p className="text-sm text-gray-600">{product.description}</p>
                </CardContent>
                <CardFooter className="justify-between items-center">
                  <span className="text-base font-medium">
                    ${product.price.toFixed(2)}
                  </span>
                  <Button size="sm" onClick={() => navigate(`/product`)}>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
