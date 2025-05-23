import Header from "./Components/Header";

declare global {
  interface Window {
    closeCartOverlay?: () => void;
  }
}
import ProductPage from "./Components/Products/productPage";
import ProductsSection from "./Components/Products/ProductsSection";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { CartProvider } from "./Components/Cart/CartContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import CartOverlay from "./Components/Cart/Cart";

function App() {
  const [isCartOverlayVisible, setCartOverlayVisible] = useState(false);

  const toggleCartOverlay = () => {
    setCartOverlayVisible((prev) => !prev);
  };

  const closeCartOverlay = () => {
    setCartOverlayVisible(false);
  };

  useEffect(() => {
    const handleOpenCartOverlay = () => setCartOverlayVisible(true);
    window.addEventListener("openCartOverlay", handleOpenCartOverlay);

    window.closeCartOverlay = closeCartOverlay;

    return () => {
      window.removeEventListener("openCartOverlay", handleOpenCartOverlay);
      window.closeCartOverlay = undefined;
    };
  }, []);

  return (
    <Router>
      <CartProvider>
        <AppContent
          isCartOverlayVisible={isCartOverlayVisible}
          setCartOverlayVisible={setCartOverlayVisible}
          toggleCartOverlay={toggleCartOverlay}
        />
        {isCartOverlayVisible && <CartOverlay onClose={closeCartOverlay} />}
      </CartProvider>
    </Router>
  );
}

function AppContent({
  isCartOverlayVisible,
  setCartOverlayVisible,
  toggleCartOverlay,
}: {
  isCartOverlayVisible: boolean;
  setCartOverlayVisible: React.Dispatch<React.SetStateAction<boolean>>;
  toggleCartOverlay: () => void;
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname.substring(1);
    if (path === "" || path === "all") {
      setActiveCategory("All");
    } else if (path === "clothes") {
      setActiveCategory("Clothes");
    } else if (path === "tech") {
      setActiveCategory("Tech");
    }
  }, [location]);

  useEffect(() => {
    setCartOverlayVisible(false);
  }, [activeCategory]);

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
        isCartOpen={isCartOverlayVisible}
        toggleCart={toggleCartOverlay}
      />

      <main className="container pt-20 mx-auto">
        <Routes>
          <Route path="/" element={<ProductsSection activeCategory="All" />} />
          {/* Add routes for categories */}
          <Route
            path="/all"
            element={<ProductsSection activeCategory="All" />}
          />
          <Route
            path="/clothes"
            element={<ProductsSection activeCategory="Clothes" />}
          />
          <Route
            path="/tech"
            element={<ProductsSection activeCategory="Tech" />}
          />
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
