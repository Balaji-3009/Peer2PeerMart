"use client";

import { useState, useEffect } from "react";
import {
  Package,
  ShoppingCart,
  Heart,
  ChevronRight,
  ChevronLeft,
  ClipboardList,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { NavBar } from "./NavBar"; // Import the NavBar component

const SideBar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { icon: <Home className="h-5 w-5" />, label: "Home", href: "/products" },
    {
      icon: <ClipboardList className="h-5 w-5" />,
      label: "My Products",
      href: "/myproducts",
    },
    {
      icon: <Package className="h-5 w-5" />,
      label: "Create Product",
      href: "/create",
    },
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      label: "Received Orders",
      href: "/received",
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: "Wishlist",
      href: "/wishlist",
    },
  ];

  return (
    <>
      <Toaster richColors position="top-right" />

      {/* Top Navbar */}
      <NavBar />

      {/* Sidebar for Desktop */}
      {!isMobile ? (
        <div
          className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col z-20 pt-16 ${
            isOpen ? "w-64" : "w-16"
          }`}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 top-20 bg-purple-600 text-white rounded-full p-1 hover:bg-purple-700"
            onClick={toggleSidebar}
          >
            {isOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>

          <div className="flex flex-col items-center pt-4 mt-7">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`flex items-center w-full p-4 text-gray-700 hover:bg-purple-100 transition-colors ${
                  isOpen ? "justify-start space-x-4" : "justify-center"
                }`}
              >
                {item.icon}
                {isOpen && (
                  <span className="font-medium ml-4">{item.label}</span>
                )}
              </a>
            ))}
          </div>
        </div>
      ) : (
        /* Mobile Bottom Navbar */
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg flex justify-around py-3 z-20">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="flex flex-col items-center text-gray-700 hover:text-purple-600"
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </a>
          ))}
        </div>
      )}
    </>
  );
};

export default SideBar;
