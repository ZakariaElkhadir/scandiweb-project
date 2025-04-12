import Header from "./Components/Header";
import ProductPage from "./Components/Products/productPage";
import ProductsSection from "./Components/Products/ProductsSection";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CartProvider } from "./Components/Cart/CartContext";
function App() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <>
      <Router>
        <CartProvider>
          <Header
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </CartProvider>
        <main className="container pt-20 ">
          {/* <ProductsSection activeCategory={activeCategory}/> */}
          {/* <ProductPage productId="apple-airtag" /> */}

          <Routes>
            <Route
              path="/"
              element={<ProductsSection activeCategory={activeCategory} />}
            />
            <Route path="/product/:id" element={<ProductPage />} />
          </Routes>
        </main>
      </Router>
    </>
  );
}
export default App;
