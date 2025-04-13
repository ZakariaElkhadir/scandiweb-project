import Header from "./Components/Header";
import ProductPage from "./Components/Products/productPage";
import ProductsSection from "./Components/Products/ProductsSection";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CartProvider } from "./Components/Cart/CartContext";
import { ToastContainer } from "react-toastify";
function App() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <>
      <Router>
        <CartProvider>
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
            setActiveCategory={setActiveCategory}
          />

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
        </CartProvider>
      </Router>
    </>
  );
}
export default App;
