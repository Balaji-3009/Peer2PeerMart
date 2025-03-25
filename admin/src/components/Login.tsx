import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { Toaster, toast } from 'sonner';

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const firebaseConfig = {
  apiKey: "AIzaSyAtUlalrUexjrOZzBnAKnXuM0wcu-7Zw4A",
  authDomain: "p2pmart-11931.firebaseapp.com",
  projectId: "p2pmart-11931",
  storageBucket: "p2pmart-11931.appspot.com",
  messagingSenderId: "518764149584",
  appId: "1:518764149584:web:64ab8c43d196d24d684a55",
  measurementId: "G-XK6H06303L",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// console.log(auth);

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function googleSignIn() {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      localStorage.setItem("idToken", idToken);

      const response = await fetch(`${VITE_BACKEND_URL}/login/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      if (data.uuid) {
        localStorage.setItem("uuid", data.uuid);
        toast.success("Login successful!");

        if (data.uuid && idToken) {
          fetchUserDetails(data.uuid, idToken);
        }
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      toast.error("Google Sign-In failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserDetails(uuid: string, idToken: string) {
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

      const data = await response.json();

      // Handle 404 specifically
      if (response.status === 404 || data.status === "404") {
        toast.error("Please complete your profile");
        navigate("/details");
        return;
      }

      // For other error statuses
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user details");
      }

      // Success case - user exists
      navigate("/dashboard");
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Error fetching user details");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={googleSignIn}
            disabled={loading}
            className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center space-x-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
              />
            </svg>
            <span>Continue with Google</span>
          </Button>
        </CardContent>
      </Card>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">
              Connecting to your account...
            </p>
          </div>
        </div>
      )}

      <Toaster position="top-center" />
    </div>
  );
}

export default Login;
