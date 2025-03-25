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
  const userId = "s9dBDmERh9hA2WX1M2vrVZdZ3Um1";
  const authToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjMwYjIyMWFiNjU2MTdiY2Y4N2VlMGY4NDYyZjc0ZTM2NTIyY2EyZTQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiR29rdWwgMjJCQ0UyOTQ1IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0t0UVBQSV9XRnIzZXFfaFF3cndSSzRCQ0RpcHM3Mk9qaEVaenVSYURzZ0tZdHFqZz1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9wMnBtYXJ0LTExOTMxIiwiYXVkIjoicDJwbWFydC0xMTkzMSIsImF1dGhfdGltZSI6MTc0Mjg5ODE3MCwidXNlcl9pZCI6InM5ZEJEbUVSaDloQTJXWDFNMnZyVlpkWjNVbTEiLCJzdWIiOiJzOWRCRG1FUmg5aEEyV1gxTTJ2clZaZFozVW0xIiwiaWF0IjoxNzQyODk4MTcwLCJleHAiOjE3NDI5MDE3NzAsImVtYWlsIjoiZ29rdWwuMjAyMkB2aXRzdHVkZW50LmFjLmluIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTU5MTIxMzUyNDQzNDU3MzM3MDMiXSwiZW1haWwiOlsiZ29rdWwuMjAyMkB2aXRzdHVkZW50LmFjLmluIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.GRz0AOE6Nib8IBFH17MFzcOib2vsYjqmMB6M5CCN51NgGhuMuaGB0hh-SZ7inzEHbn6AhyJdsTmZmxw60E8hIz4Aox3oTSiMTJaPIU7b8GpYH5GzNZ5wULIM43P3SFmG0B5wNVSxvT8rAHrGZGCJt-dTQzCL26Z3-csLd53ZMh18LHzCIQS8XVvava5Hk6KHJ3vT8ywLutG2ZG6iMHSc9-zo6gDLQatYpBiXdIMsWHP-lZjxDpPfIrJXbTECSbwHc9XJL1N3iFr0zkR82z-hO9PTLnX83SZIXH3CoxKlOXF-kXDsH2TqV_yxzBscWMoLr7Hh-MV0fR_UuoUrZ9KfOQ"

  useEffect(() => {
    axios.get(`https://peer2peermart-y0wq.onrender.com/products/getProduct/${productId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      params: {
        user_id: userId
      }
    })
      .then(response => setProduct(response.data.data))
      .catch(error => console.error(error));
  }, [productId]);

  const handleDelete = () => {
    axios.delete(`https://peer2peermart-y0wq.onrender.com/products/deleteProduct`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      params: {
        productId: productId
      }
    })
      .then(() => {
        alert('Product deleted successfully');
        navigate('/dashboard');
      })
      .catch(error => console.error(error));
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
