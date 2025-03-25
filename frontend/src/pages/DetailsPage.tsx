import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { User, Mail, Phone, Hash } from "lucide-react";
import { toast } from "sonner";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function DetailsPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    pno: "",
    regNo: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const uuid = localStorage.getItem("uuid");
      const idToken = localStorage.getItem("idToken");

      if (!uuid || !idToken) {
        throw new Error("Authentication required");
      }

      // Validate all fields
      if (
        !formData.name ||
        !formData.pno ||
        !formData.regNo ||
        !formData.email
      ) {
        throw new Error("Please fill all fields");
      }

      const response = await fetch(`${VITE_BACKEND_URL}/users/createUsers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          uuid: uuid,
          name: formData.name,
          regNo: formData.regNo,
          email: formData.email,
          pno: formData.pno,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create profile");
      }

      toast.success("Profile created successfully!");
      navigate("/products"); // Redirect after successful submission
    } catch (error) {
      toast.error(error.message || "Error creating profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="bg-white/20 p-3 rounded-full">
              <User className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Create Profile</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="flex items-center gap-2 text-gray-600"
                >
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="flex items-center gap-2 text-gray-600"
                >
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="pno"
                  className="flex items-center gap-2 text-gray-600"
                >
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="pno"
                  name="pno"
                  value={formData.pno}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              {/* Registration Number Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="regNo"
                  className="flex items-center gap-2 text-gray-600"
                >
                  <Hash className="h-4 w-4" />
                  Registration Number
                </Label>
                <Input
                  id="regNo"
                  name="regNo"
                  value={formData.regNo}
                  onChange={handleChange}
                  placeholder="Enter your registration number"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Profile..." : "Create Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
