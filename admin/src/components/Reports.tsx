import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import Sidebar from './Sidebar';

interface Report {
  id: number;
  productId: number;
  productName: string;
  sellerName: string;
  reporter_id: string;
  reporter_name: string;
  price: string;
  desc: string;
  image: string;
  reason: string;
  created_at: string;
  updated_at: string;
}

function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const userId = "s9dBDmERh9hA2WX1M2vrVZdZ3Um1";
  const authToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjMwYjIyMWFiNjU2MTdiY2Y4N2VlMGY4NDYyZjc0ZTM2NTIyY2EyZTQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiR29rdWwgMjJCQ0UyOTQ1IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0t0UVBQSV9XRnIzZXFfaFF3cndSSzRCQ0RpcHM3Mk9qaEVaenVSYURzZ0tZdHFqZz1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9wMnBtYXJ0LTExOTMxIiwiYXVkIjoicDJwbWFydC0xMTkzMSIsImF1dGhfdGltZSI6MTc0MjkyMjAxMCwidXNlcl9pZCI6InM5ZEJEbUVSaDloQTJXWDFNMnZyVlpkWjNVbTEiLCJzdWIiOiJzOWRCRG1FUmg5aEEyV1gxTTJ2clZaZFozVW0xIiwiaWF0IjoxNzQyOTIyMDEwLCJleHAiOjE3NDI5MjU2MTAsImVtYWlsIjoiZ29rdWwuMjAyMkB2aXRzdHVkZW50LmFjLmluIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTU5MTIxMzUyNDQzNDU3MzM3MDMiXSwiZW1haWwiOlsiZ29rdWwuMjAyMkB2aXRzdHVkZW50LmFjLmluIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.tW9ebvaGOsXB46nl9QbYlJr1jejY4Yc37U3DCHTbObgoNlpn5fZ1ZLOIGRmQ9Ipd9OxzfLcWovGBUl9WgsBmZhl5iLlwfQRQ0TOBx7X-V7EcURcoZC-qAQvGdZ5ROnRcyegY_9JEw9ixKjIl1r_10s1hRPXjpD1t7EFKoMOvkGk2SfJIJ1k-X6QxFJmah2b9JApjgj7wNkEEFbjxR1_bPpAC_yNxEgRH9uSWDI3C1rfImksliPKaZn06HCDdOqXoC9Z26cuqskl8rYFSaO0HjkoCPjRJ4VY_rTx7ufwCLS_c1sNosna2hmanwQwPBgKOjCOdhxT4ArGPrBT2RoTXVg";

  useEffect(() => {
    axios.get('https://peer2peermart-y0wq.onrender.com/admin/getReports', {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      params: {
        user_id: userId
      }
    })
      .then(response => setReports(response.data.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <Sidebar />
    <div className="m-12 min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {reports.map(report => (
                <li key={report.id} className="py-4">
                  <h3 className="text-lg font-semibold">{report.productName}</h3>
                  <p className="text-gray-600">Reported by: {report.reporter_name}</p>
                  <p className="text-gray-600">Reason: {report.reason}</p>
                  <p className="text-gray-600">Description: {report.desc}</p>
                  <p className="text-gray-600">Price: &#x20B9;{report.price}</p>
                  <p className="text-gray-600">Seller: {report.sellerName}</p>
                  <img src={report.image} alt={report.productName} className="w-full h-48 object-cover rounded-md mb-4" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No reports found.</p>
          )}
        </CardContent>
      </Card>
    </div>
    </div>
  );
}

export default Reports;
