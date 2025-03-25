import React, { useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

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

const AuthPage = () => {
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
<<<<<<< HEAD

      // For other error statuses
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user details");
      }

      // Success case - user exists
=======
      console.log(uuid)
      console.log(idToken)
      const userData = await response.json();
>>>>>>> f82211276dbe2539a02a37200aa9052c4584a70a
      navigate("/products");
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Error fetching user details");
      // Optional: navigate to login or retry
      // navigate("/login");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-scale">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6 animate-fade">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-800 mb-3">
            P2PMart
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">
            The campus marketplace for students to buy and sell books, gadgets,
            and essentials
          </p>
        </div>

<<<<<<< HEAD
        <div
          className="glass rounded-2xl overflow-hidden shadow-xl p-8 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
=======
        <div className="glass rounded-2xl overflow-hidden shadow-xl p-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
>>>>>>> f82211276dbe2539a02a37200aa9052c4584a70a
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Join Your Campus Marketplace
            </h2>
            <p className="text-gray-500 text-sm">
              Sign in with your college Google account to get started
            </p>
          </div>

          <button
            onClick={googleSignIn}
            disabled={loading}
            className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center space-x-3 relative overflow-hidden group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
              />
            </svg>
            <span>Continue with Google</span>

            <div className="absolute inset-0 h-full w-full scale-0 rounded-xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></div>
          </button>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              By signing in, you agree to our{" "}
              <Link
                to="/terms"
                className="text-primary hover:underline font-medium"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-primary hover:underline font-medium"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50 animate-fade">
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
};

export default AuthPage;
