import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage"; // Ensure correct import
import ProductDetailPage from "./pages/ProductDetailPage"; // Ensure correct import
import WishlistPage from "./pages/WishlistPage"; // Ensure correct import
import ReceivedOrders from "./pages/ReceivedOrders"; // Ensure correct import
import DetailsPage from "./pages/DetailsPage"; // Ensure correct import
import CreateProductPage from "./pages/CreateProductPage"; // Ensure correct import
import Sidebar from "../src/components/SideBar";
import "./App.css";
import AuthPage from "./pages/AuthPage";
import MyProducts from "./pages/MyProducts";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/received" element={<ReceivedOrders />} />
        <Route path="/create" element={<CreateProductPage />} />
        <Route path="/details" element={<DetailsPage />} />
        <Route path="/myproducts" element={<MyProducts />} />
      </Routes>
    </Router>
  );
}

export default App;
