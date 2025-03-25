import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const userId = localStorage.getItem("uuid") || "";
  const authToken = localStorage.getItem("idToken") || "";

  useEffect(() => {
    if (!userId || !authToken) {
      navigate("/login");
      return;
    }
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('https://peer2peermart-y0wq.onrender.com/admin/getReports', {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        params: {
          user_id: userId
        }
      });
      setReports(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

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
                    <p className="text-gray-600">Product Description: {report.desc}</p>
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
