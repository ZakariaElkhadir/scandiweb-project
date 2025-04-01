import logo from "../assets/logo.png";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Clothing", "Tech"];

  return (
    <header className="bg-white h-16 fixed w-full">
      <div className="container mx-auto flex items-center justify-between py-3 px-20">
        {/* Collection buttons */}
        <div className="collections flex space-x-4 gap-4">
          {categories.map((category) => (
            <button
              key={category}
              className={`text-gray-700 hover:text-gray-900 uppercase cursor-pointer relative ${
                activeCategory === category ? "font-medium" : ""
              }`}
              data-testid={
                activeCategory === category
                  ? "active-category-link"
                  : "category-link"
              }
              onClick={() => setActiveCategory(category)}
            >
              {category}
              {activeCategory === category && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 -mb-2"></div>
              )}
            </button>
          ))}
        </div>
        
        {/* Logo */}
        <div className="logo absolute left-1/2 transform -translate-x-1/2">
          <img src={logo} alt="Logo" className="h-8" />
        </div>
        
        {/* Cart button */}
        <button className="text-gray-700 hover:text-gray-900 cursor-pointer">
          <ShoppingCart />
        </button>
      </div>
    </header>
  );
};

export default Header;