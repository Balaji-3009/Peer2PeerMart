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
  const userId = "Xt0TVWGDRZPon4JRARlvZbuAnEy2";
  const authToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjMwYjIyMWFiNjU2MTdiY2Y4N2VlMGY4NDYyZjc0ZTM2NTIyY2EyZTQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiR29rdWwiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jS1o2bVo2SHpjTjBMNEQ2NW4tNzlFTFpSMDJLRFFMVEQ1SDNfbG1tZWNBQTBIcz1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9wMnBtYXJ0LTExOTMxIiwiYXVkIjoicDJwbWFydC0xMTkzMSIsImF1dGhfdGltZSI6MTc0MjgzMjc2NCwidXNlcl9pZCI6Ilh0MFRWV0dEUlpQb240SlJBUmx2WmJ1QW5FeTIiLCJzdWIiOiJYdDBUVldHRFJaUG9uNEpSQVJsdlpidUFuRXkyIiwiaWF0IjoxNzQyODMyNzY0LCJleHAiOjE3NDI4MzYzNjQsImVtYWlsIjoidGVtcC5nb2t1bDA0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTAzNzk4OTM1Mzg1NzA2NDE5NDI0Il0sImVtYWlsIjpbInRlbXAuZ29rdWwwNEBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.xTpT4svcPUqGGcSVpe_qTsYtffMLfgFc2nFNOD83ItD1MerLl3jE8T5cvDSqgDGlLvnxbgp4vlGz-C6XB_n0PJ6KEWuj4NM9w1eRWB4IXgBk-toJVV3wMf19SuE7QBn1s0tIIiQmPA9uegkNugjaOdVqGEesFCl7baSe2GnzHBLlQWqAcLbeyUiFbi2P-s2Ec-aQj56EwAP_oXbnN5izfMpOMSwWudj8LtpVpm8vRhEIdsG7Irwjr_4RvCCOH4y2hXV_tUpXU8J7IgEarKV6OQGoEZRMt82pWKgDSl5UxGPyeqTZwFxBbvdjl-D2RA3bd2fnxm5gkNnyPoPRtlWFgg";

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
