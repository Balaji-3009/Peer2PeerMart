import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export const NavBar = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    pno: string;
    regNo: string;
  } | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    // Fetch user data from the backend
    const fetchUserData = async () => {
      const uuid = localStorage.getItem("uuid");
      const idToken = localStorage.getItem("idToken"); // Retrieve the idToken from local storage

      if (!uuid || !idToken) {
        console.error("UUID or idToken not found in local storage");
        return;
      }

      try {
        const response = await fetch(
          `https://peer2peermart.onrender.com/users/getUser/${uuid}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`, // Include the Bearer token
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.status === "success") {
          setUserData(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("uuid");
    toast.success("Logged out successfully!", {
      description: "You have been logged out of your account.",
      duration: 3000, // Toast disappears after 3 seconds
    });
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md py-3 px-6 flex justify-between items-center z-30">
      <h1 className="text-xl font-bold text-purple-600">P2P Mart</h1>
      <div className="flex items-center gap-4">
        {/* Profile Icon and Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setIsProfileOpen(true)}
          onMouseLeave={() => setIsProfileOpen(false)}
        >
          <button className="flex items-center gap-2 bg-purple-100 p-2 rounded-full hover:bg-purple-200 transition">
            <User className="h-5 w-5 text-purple-600" />
            {userData && (
              <span className="text-purple-600 font-medium">
                Welcome, {userData.name.split(" ")[0]}
              </span>
            )}
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && userData && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-purple-100 rounded-lg shadow-lg z-40">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-purple-600">
                      {userData.name}
                    </h2>
                    <p className="text-sm text-gray-600">{userData.email}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Phone:</span> {userData.pno}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Reg No:</span>{" "}
                    {userData.regNo}
                  </p>
                </div>
                <div className="mt-4">
                  <Button
                    variant="ghost"
                    className="w-full bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition"
                    onClick={handleLogout}
                  >
                    Logout <LogOut className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
