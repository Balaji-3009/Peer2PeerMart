import React, { useState, useEffect } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

const firebaseConfig = {
  apiKey: "AIzaSyAtUlalrUexjrOZzBnAKnXuM0wcu-7Zw4A",
  authDomain: "p2pmart-11931.firebaseapp.com",
  projectId: "p2pmart-11931",
  storageBucket: "p2pmart-11931.firebasestorage.app",
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
      console.log("User ID Token:", idToken);

      const response = await fetch(
        "https://peer2peermart.onrender.com/login/google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        }
      );

      const data = await response.json();
      if (data.uuid) {
        localStorage.setItem("uuid", data.uuid);
        console.log(data.uuid);
        toast.success("Login successful!");

        // Call fetchUserDetails only if uuid and idToken exist
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

  async function fetchUserDetails(uuid, idToken) {
    try {
      const response = await fetch(
        `https://peer2peermart.onrender.com/users/getUser/${uuid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("User not found");
      }

      const userData = await response.json();
      navigate("./products");
    } catch (error) {
      toast.error("User not found. Redirecting...");
      navigate("/details");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-lg transform transition-all hover:scale-105 w-96">
        <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">
          P2PMart
        </h1>
        <p className="mb-6 text-center text-gray-600">
          Sign in with Google to buy and sell books, gadgets, and essentials
          with fellow students!
        </p>
        <button
          onClick={googleSignIn}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
        >
          Sign in with Google
        </button>
      </div>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-40">
          <div className="animate-spin rounded-full border-4 border-t-4 border-red-500 w-16 h-16"></div>
        </div>
      )}

      <Toaster />
    </div>
  );
};

export default AuthPage;
