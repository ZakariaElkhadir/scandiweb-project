import Header from "./Components/Header"
import ProductsSection from "./Components/Products/ProductsSection"
import { useState } from "react"

function App() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <>
     <Header activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
     <main className="container pt-20 "> 
      <ProductsSection activeCategory={activeCategory}/>
     </main>
    </>
  )
}

export default App
