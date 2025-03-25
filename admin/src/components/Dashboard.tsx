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
  const userId = "Xt0TVWGDRZPon4JRARlvZbuAnEy2";
  const authToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjMwYjIyMWFiNjU2MTdiY2Y4N2VlMGY4NDYyZjc0ZTM2NTIyY2EyZTQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiR29rdWwiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jS1o2bVo2SHpjTjBMNEQ2NW4tNzlFTFpSMDJLRFFMVEQ1SDNfbG1tZWNBQTBIcz1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9wMnBtYXJ0LTExOTMxIiwiYXVkIjoicDJwbWFydC0xMTkzMSIsImF1dGhfdGltZSI6MTc0MjgzMjc2NCwidXNlcl9pZCI6Ilh0MFRWV0dEUlpQb240SlJBUmx2WmJ1QW5FeTIiLCJzdWIiOiJYdDBUVldHRFJaUG9uNEpSQVJsdlpidUFuRXkyIiwiaWF0IjoxNzQyODMyNzY0LCJleHAiOjE3NDI4MzYzNjQsImVtYWlsIjoidGVtcC5nb2t1bDA0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTAzNzk4OTM1Mzg1NzA2NDE5NDI0Il0sImVtYWlsIjpbInRlbXAuZ29rdWwwNEBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.xTpT4svcPUqGGcSVpe_qTsYtffMLfgFc2nFNOD83ItD1MerLl3jE8T5cvDSqgDGlLvnxbgp4vlGz-C6XB_n0PJ6KEWuj4NM9w1eRWB4IXgBk-toJVV3wMf19SuE7QBn1s0tIIiQmPA9uegkNugjaOdVqGEesFCl7baSe2GnzHBLlQWqAcLbeyUiFbi2P-s2Ec-aQj56EwAP_oXbnN5izfMpOMSwWudj8LtpVpm8vRhEIdsG7Irwjr_4RvCCOH4y2hXV_tUpXU8J7IgEarKV6OQGoEZRMt82pWKgDSl5UxGPyeqTZwFxBbvdjl-D2RA3bd2fnxm5gkNnyPoPRtlWFgg";

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
    <div className="min-h-screen bg-gray-100 flex pt-28">
      <Sidebar />
      <div className="flex-1 p-6">
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
  );
}

export default Dashboard;
