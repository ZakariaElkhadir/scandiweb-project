import Header from "./Components/Header";
import ProductPage from "./Components/Products/productPage";
import ProductsSection from "./Components/Products/ProductsSection";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <>
      <Header
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <main className="container pt-20 ">
        {/* <ProductsSection activeCategory={activeCategory}/> */}
        {/* <ProductPage productId="apple-airtag" /> */}
        <Router>
          <Routes>
            <Route
              path="/"
              element={<ProductsSection activeCategory={activeCategory} />}
            />
            <Route path="/product/:id" element={<ProductPage />} />
          </Routes>
        </Router>
      </main>
    </>
  );
}

export default App;
