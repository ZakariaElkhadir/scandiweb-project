import logo from "../assets/logo.png";
import { ShoppingCart } from "lucide-react";
import CartOverlay from "./Cart/Cart";
import { useState } from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

/**
 * Header component that displays the logo, collection buttons, and cart button.
 * @param {string} activeCategory - The currently active category.
 * @param {function} setActiveCategory - Function to set the active category.
 */

const Header = ({ activeCategory, setActiveCategory }: HeaderProps) => {
  const categories = ["All", "Clothes", "Tech"];
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <header className="bg-white h-16 relative w-full">
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
          <Link to="/">
            {" "}
            {/* Wrap the logo in a Link component */}
            <img src={logo} alt="Logo" className="h-8 cursor-pointer" />
          </Link>
        </div>

        {/* Cart button */}
        <button
          className="text-gray-700 hover:text-gray-900 cursor-pointer"
          data-testid="cart-btn"
          onClick={() => {
            setIsCartOpen(!isCartOpen);
          }}
        >
          <ShoppingCart />
        </button>
      </div>
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-10"></div>
          <div className="z-20">
            <CartOverlay />
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
