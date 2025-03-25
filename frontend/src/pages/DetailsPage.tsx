import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Edit } from "lucide-react";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function DetailsPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const uuid = localStorage.getItem("uuid");
      const idToken = localStorage.getItem("idToken");

      if (!uuid || !idToken) {
        alert("User authentication missing.");
        return;
      }

      try {
        const response = await fetch(
          `${VITE_BACKEND_URL}/users/getUser/${uuid}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error("Error fetching user details");
          navigate("/login");
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEditProfile = () => {
    navigate("/update-profile");
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 pt-24">
      <Card className="w-full max-w-2xl relative">
        <Button
          onClick={handleEditProfile}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Full Name</p>
              <p className="text-sm">{userData.name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Phone Number</p>
              <p className="text-sm">{userData.pno}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Registration Number</p>
              <p className="text-sm">{userData.regNo}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Email Address</p>
              <p className="text-sm">{userData.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
