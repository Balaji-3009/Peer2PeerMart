import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../components/ui';
import Sidebar from './Sidebar';

interface Product {
  id: number;
  name: string;
  price: string;
  desc: string;
  image: string;
  negotiable: number;
  user_name: string;
}

function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("uuid") || "";
  const authToken = localStorage.getItem("idToken") || "";

  useEffect(() => {
    if (!userId || !authToken) {
      navigate("/login");
      return;
    }
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`https://peer2peermart-y0wq.onrender.com/products/getProduct/${productId}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        params: {
          user_id: userId
        }
      });
      setProduct(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://peer2peermart-y0wq.onrender.com/products/deleteProduct`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        params: {
          productId: productId
        }
      });
      alert('Product deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-md mb-4" />
            <p className="text-gray-600 text-xl font-bold">&#x20B9;{product.price}</p>
            <p className="text-gray-500 mt-2">{product.desc}</p>
            <p className="text-gray-500 mt-2">Seller: {product.user_name}</p>
            <Button variant="destructive" onClick={handleDelete} className="mt-4">Delete Product</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProductDetail;
