import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '../components/ui';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from '../components/ui';
import { Filter, Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Slider } from '../components/ui/slider';

interface Product {
  id: number;
  name: string;
  price: string;
  desc: string;
  image: string;
  negotiable: number;
  user_name: string;
}

function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const navigate = useNavigate();
  const userId = "s9dBDmERh9hA2WX1M2vrVZdZ3Um1";
  const authToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjMwYjIyMWFiNjU2MTdiY2Y4N2VlMGY4NDYyZjc0ZTM2NTIyY2EyZTQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiR29rdWwgMjJCQ0UyOTQ1IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0t0UVBQSV9XRnIzZXFfaFF3cndSSzRCQ0RpcHM3Mk9qaEVaenVSYURzZ0tZdHFqZz1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9wMnBtYXJ0LTExOTMxIiwiYXVkIjoicDJwbWFydC0xMTkzMSIsImF1dGhfdGltZSI6MTc0MjkyMjAxMCwidXNlcl9pZCI6InM5ZEJEbUVSaDloQTJXWDFNMnZyVlpkWjNVbTEiLCJzdWIiOiJzOWRCRG1FUmg5aEEyV1gxTTJ2clZaZFozVW0xIiwiaWF0IjoxNzQyOTIyMDEwLCJleHAiOjE3NDI5MjU2MTAsImVtYWlsIjoiZ29rdWwuMjAyMkB2aXRzdHVkZW50LmFjLmluIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTU5MTIxMzUyNDQzNDU3MzM3MDMiXSwiZW1haWwiOlsiZ29rdWwuMjAyMkB2aXRzdHVkZW50LmFjLmluIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.tW9ebvaGOsXB46nl9QbYlJr1jejY4Yc37U3DCHTbObgoNlpn5fZ1ZLOIGRmQ9Ipd9OxzfLcWovGBUl9WgsBmZhl5iLlwfQRQ0TOBx7X-V7EcURcoZC-qAQvGdZ5ROnRcyegY_9JEw9ixKjIl1r_10s1hRPXjpD1t7EFKoMOvkGk2SfJIJ1k-X6QxFJmah2b9JApjgj7wNkEEFbjxR1_bPpAC_yNxEgRH9uSWDI3C1rfImksliPKaZn06HCDdOqXoC9Z26cuqskl8rYFSaO0HjkoCPjRJ4VY_rTx7ufwCLS_c1sNosna2hmanwQwPBgKOjCOdhxT4ArGPrBT2RoTXVg";

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, priceRange, products]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://peer2peermart-y0wq.onrender.com/products/getProducts', {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        params: {
          user_id: userId
        }
      });
      const data = response.data.data;
      const formattedProducts = data.map((product: Product) => ({
        ...product,
        price: parseFloat(product.price) || 0,
      }));
      setProducts(formattedProducts);
      setFilteredProducts(formattedProducts);
      const maxPrice = Math.max(...formattedProducts.map((p: Product) => p.price), 100);
      setPriceRange([0, maxPrice]);
    } catch (error) {
      console.error(error);
    }
  };

  const filterProducts = () => {
    const filtered = products.filter(
      product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        parseFloat(product.price) >= priceRange[0] &&
        parseFloat(product.price) <= priceRange[1]
    );
    setFilteredProducts(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePriceChange = (range: number[]) => {
    setPriceRange(range);
  };

  return (
    <div>
      <Sidebar />
    <div className="m-12 min-h-screen bg-gray-100 flex pt-28">

      <div className="flex-1 p-10">
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
                onChange={handleSearchChange}
                className="pr-20 rounded-full"
              />
              <div className="absolute right-0 top-0 bottom-0 flex items-center">
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
                          max={priceRange[1]}
                          step={1}
                          value={priceRange}
                          onValueChange={handlePriceChange}
                          className="my-4"
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button className="rounded-full">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <Card key={product.id} onClick={() => navigate(`/product/${product.id}`)} className="cursor-pointer">
                  <CardContent>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <p className="text-gray-500">{product.desc}</p>
                  </CardContent>
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
    </div>
  );
}

export default Dashboard;
