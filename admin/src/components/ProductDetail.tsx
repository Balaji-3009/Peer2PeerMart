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
  const authToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjMwYjIyMWFiNjU2MTdiY2Y4N2VlMGY4NDYyZjc0ZTM2NTIyY2EyZTQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiR29rdWwgMjJCQ0UyOTQ1IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0t0UVBQSV9XRnIzZXFfaFF3cndSSzRCQ0RpcHM3Mk9qaEVaenVSYURzZ0tZdHFqZz1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9wMnBtYXJ0LTExOTMxIiwiYXVkIjoicDJwbWFydC0xMTkzMSIsImF1dGhfdGltZSI6MTc0MjkyMjAxMCwidXNlcl9pZCI6InM5ZEJEbUVSaDloQTJXWDFNMnZyVlpkWjNVbTEiLCJzdWIiOiJzOWRCRG1FUmg5aEEyV1gxTTJ2clZaZFozVW0xIiwiaWF0IjoxNzQyOTIyMDEwLCJleHAiOjE3NDI5MjU2MTAsImVtYWlsIjoiZ29rdWwuMjAyMkB2aXRzdHVkZW50LmFjLmluIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTU5MTIxMzUyNDQzNDU3MzM3MDMiXSwiZW1haWwiOlsiZ29rdWwuMjAyMkB2aXRzdHVkZW50LmFjLmluIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.tW9ebvaGOsXB46nl9QbYlJr1jejY4Yc37U3DCHTbObgoNlpn5fZ1ZLOIGRmQ9Ipd9OxzfLcWovGBUl9WgsBmZhl5iLlwfQRQ0TOBx7X-V7EcURcoZC-qAQvGdZ5ROnRcyegY_9JEw9ixKjIl1r_10s1hRPXjpD1t7EFKoMOvkGk2SfJIJ1k-X6QxFJmah2b9JApjgj7wNkEEFbjxR1_bPpAC_yNxEgRH9uSWDI3C1rfImksliPKaZn06HCDdOqXoC9Z26cuqskl8rYFSaO0HjkoCPjRJ4VY_rTx7ufwCLS_c1sNosna2hmanwQwPBgKOjCOdhxT4ArGPrBT2RoTXVg"

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
