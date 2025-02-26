import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; // Ensure correct import
import ProductsPage from "./pages/ProductsPage"; // Ensure correct import
import ProductDetailPage from "./pages/ProductDetailPage"; // Ensure correct import
import WishlistPage from "./pages/WishlistPage"; // Ensure correct import
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product" element={<ProductDetailPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
    </Router>
  );
}

export default App;
