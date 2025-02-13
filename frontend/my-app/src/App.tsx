import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; // Ensure correct import
import ProductsPage from "./pages/ProductsPage"; // Ensure correct import
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Login />} />
        <Route path="/products" element={<ProductsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
