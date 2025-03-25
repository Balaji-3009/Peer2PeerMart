import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface UserData {
  uuid: string;
  name: string;
  pno: string;
  regNo: string;
  email: string;
}

export default function DetailsUpdatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<UserData>({
    uuid: "",
    name: "",
    pno: "",
    regNo: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const initializeData = async () => {
      try {
        const uuid = localStorage.getItem("uuid") || "";

        // First try to get data from navigation state
        if (location.state?.userData) {
          const { name, pno, regNo, email } = location.state.userData;
          setFormData({
            uuid,
            name: name || "",
            pno: pno || "",
            regNo: regNo || "",
            email: email || "",
          });
        } else {
          // Fallback to fetching from API
          await fetchUserData(uuid);
        }
      } catch (err) {
        console.error("Initialization error:", err);
        setError("Failed to load user data");
      }
    };

    initializeData();
  }, [location.state]);

  const fetchUserData = async (uuid: string) => {
    try {
      const idToken = localStorage.getItem("idToken");
      if (!idToken) throw new Error("Authentication required");

      const response = await fetch(
        `${VITE_BACKEND_URL}/users/getUser/${uuid}`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch user data");

      const data = await response.json();
      if (data.status === "success") {
        setFormData({
          uuid,
          name: data.data.name || "",
          pno: data.data.pno || "",
          regNo: data.data.regNo || "",
          email: data.data.email || "",
        });
      }
    } catch (err) {
      console.error("Fetch error:", err);
      throw err;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate required fields
      if (
        !formData.name ||
        !formData.pno ||
        !formData.regNo ||
        !formData.email
      ) {
        throw new Error("All fields are required");
      }

      // Validate phone number format (10 digits)
      if (!/^\d{10}$/.test(formData.pno)) {
        throw new Error("Phone number must be 10 digits");
      }

      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error("Invalid email format");
      }

      const idToken = localStorage.getItem("idToken");
      if (!idToken) throw new Error("Authentication required");
      const uuid = localStorage.getItem("uuid");
      // Prepare data in exact required format
      const requestData = {
        uuid: uuid,
        name: formData.name,
        regNo: formData.regNo,
        email: formData.email,
        pno: formData.pno,
      };

      const response = await fetch(
        `${VITE_BACKEND_URL}/users/updateUser?userId=${uuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify(requestData), // Sending in exact required format
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Update failed");
      }

      toast.success("Profile updated successfully!");
      navigate("/products", { state: { refreshed: true } });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Update failed";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 pt-24">
      <Card className="w-full max-w-2xl">
        <CardHeader className="border-b">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              disabled={isLoading}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">Update Profile</h2>
          </div>
        </CardHeader>

        <CardContent className="mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pno">Phone Number *</Label>
                <Input
                  id="pno"
                  name="pno"
                  value={formData.pno}
                  onChange={handleChange}
                  required
                  pattern="\d{10}"
                  title="10 digit phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="regNo">Registration Number *</Label>
                <Input
                  id="regNo"
                  name="regNo"
                  value={formData.regNo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        </CardContent>

        <CardFooter className="flex justify-end gap-2 border-t pt-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Updating..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
