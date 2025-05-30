import logo from "../assets/logo.png";
import { ShoppingCart, Menu, X } from "lucide-react";
import CartOverlay from "./Cart/Cart";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./Cart/CartContext";

interface HeaderProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  isCartOpen: boolean;
  toggleCart: () => void;
}

const Header = ({
  activeCategory,
  setActiveCategory,
  isCartOpen,
  toggleCart,
}: HeaderProps) => {
  const categories = ["All", "Clothes", "Tech"];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { state } = useCart();
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest(".mobile-menu-container")) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isMobileMenuOpen]);

  // Cart is now managed by App.tsx

  return (
    <header className="bg-white h-16 fixed w-full z-20 ">
      <div className="container mx-auto flex items-center justify-between h-full py-3 px-4 sm:px-6 md:px-8 lg:px-20">
        {/* Mobile hamburger menu */}
        <button
          className="text-gray-700 md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Collection links - desktop */}
        <div className="collections hidden md:flex space-x-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/${category.toLowerCase()}`}
              className={`text-gray-700 hover:text-gray-900 uppercase cursor-pointer relative ${
                activeCategory === category ? "font-medium" : ""
              }`}
              data-testid={
                activeCategory === category
                  ? "active-category-link"
                  : "category-link"
              }
              data-category={`${category.toLowerCase()}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveCategory(category);
                // Use the global closeCartOverlay if it exists
                if (window.closeCartOverlay) {
                  window.closeCartOverlay();
                }
              }}
            >
              {category}
              {activeCategory === category && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 w-full bg-green-500 -mb-2"></div>
              )}
            </Link>
          ))}
        </div>

        <div className="logo mx-auto md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
          <Link
            to="/"
            className="text-gray-700 hover:text-gray-900 uppercase cursor-pointer relative"
            data-testid="logo-link"
            onClick={(e) => {
              e.preventDefault();
              setActiveCategory("All");
              if (isCartOpen && window.closeCartOverlay) {
                window.closeCartOverlay();
              }
            }}
          >
            <img src={logo} alt="Logo" className="h-8 cursor-pointer" />
          </Link>
        </div>

        <button
          className="text-gray-700 hover:text-gray-900 cursor-pointer"
          data-testid="cart-btn"
          onClick={toggleCart}
          aria-label="Shopping cart"
        >
          <div className="flex relative">
            <ShoppingCart />
            {totalItems > 0 && (
              <div className="absolute -top-1 -right-2 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-container fixed inset-0 bg-white z-30 pt-16 px-4">
          <div className="flex flex-col space-y-6 mt-8">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/${category.toLowerCase()}`}
                className={`text-gray-700 text-xl hover:text-gray-900 uppercase cursor-pointer relative ${
                  activeCategory === category ? "font-medium" : ""
                }`}
                data-category={`${category.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveCategory(category);
                  if (window.closeCartOverlay) {
                    window.closeCartOverlay();
                  }
                  setIsMobileMenuOpen(false);
                }}
              >
                {category}
                {activeCategory === category && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 -mb-2"></div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Cart overlay is now managed by App.tsx */}
    </header>
  );
};

export default Header;
