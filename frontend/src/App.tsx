import Header from "./Components/Header";
import ProductPage from "./Components/Products/productPage";
import ProductsSection from "./Components/Products/ProductsSection";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { CartProvider } from "./Components/Cart/CartContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './index.css'

function App() {
  return (
    <Router>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </Router>
  );
}

// Create a separate component to use router hooks
function AppContent() {
  const [activeCategory, setActiveCategory] = useState("All");
  const location = useLocation();
  const navigate = useNavigate();

  // Update active category when URL changes
  useEffect(() => {
    const path = location.pathname.substring(1); // Remove leading /
    if (path === "all") {
      setActiveCategory("All");
    } else if (path === "clothes") {
      setActiveCategory("Clothes");
    } else if (path === "tech") {
      setActiveCategory("Tech");
    }
  }, [location]);

  // Function to handle category changes and URL updates
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    navigate(`/${category.toLowerCase()}`);
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Header
        activeCategory={activeCategory}
        setActiveCategory={handleCategoryChange}
      />

      <main className="container pt-20 mx-auto">
        <Routes>
          <Route path="/" element={<ProductsSection activeCategory={activeCategory} />} />
          {/* Add routes for categories */}
          <Route path="/all" element={<ProductsSection activeCategory="All" />} />
          <Route path="/clothes" element={<ProductsSection activeCategory="Clothes" />} />
          <Route path="/tech" element={<ProductsSection activeCategory="Tech" />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;