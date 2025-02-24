import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; // Ensure correct import
import ProductsPage from "./pages/ProductsPage"; // Ensure correct import
import ProductDetailPage from "./pages/ProductDetailPage"; // Ensure correct import
import CartPage from "./pages/CartPage"; // Ensure correct import
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Router>
  );
}

export default App;
