import { useState, useEffect } from "react";
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

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, priceRange, products]); // Re-run filter when searchTerm, priceRange, or products change

  const fetchProducts = async () => {
    try {
      const idToken = localStorage.getItem("idToken");
      const uuid = localStorage.getItem("uuid");
      if (!idToken) {
        console.error("No ID token found in localStorage");
        return;
      }

      const response = await fetch(
        `https://peer2peermart.onrender.com/products/getProducts?user_id=${uuid}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        const formattedProducts = data.data
          .filter((product) => product.name && product.price) // Remove incomplete products
          .map((product) => ({
            id: product.id,
            name: product.name || "Unnamed Product",
            description: product.desc || "No description available",
            image: product.image,
            price: parseFloat(product.price) || 0,
          }));

        setProducts(formattedProducts);
        setFilteredProducts(formattedProducts); // Initialize filteredProducts with all products

        // Dynamically set the max price for the slider
        const maxPrice = Math.max(...formattedProducts.map((p) => p.price), 100);
        setPriceRange([0, maxPrice]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const filterProducts = () => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        product.price >= priceRange[0] &&
        product.price <= priceRange[1]
    );
    setFilteredProducts(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePriceChange = (range) => {
    setPriceRange(range);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex mt-10">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="space-y-8 w-full max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-800">
            Best Finds on Campus
          </h1>
          <div className="flex justify-center">
            <div className="relative w-full max-w-xl">
              {/* Search Bar */}
              <Input
                type="text"
                placeholder="Search for amazing products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pr-20 rounded-full"
              />
              <div className="absolute right-0 top-0 bottom-0 flex">
                {/* Filter Popover */}
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
                          <span>&#8377;{priceRange[0]}</span>
                          <span>&#8377;{priceRange[1]}</span>
                        </div>
                        <Slider
                          max={priceRange[1]} // Set max dynamically
                          step={1}
                          value={priceRange}
                          onValueChange={handlePriceChange}
                          className="my-4"
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Search Button */}
                <Button className="rounded-full">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={product.image || img}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  </CardContent>
                  <CardFooter className="justify-between items-center">
                    <span className="text-base font-medium">
                      &#8377;{product.price.toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-3">
                No products found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}