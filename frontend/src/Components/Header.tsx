import logo from "../assets/logo.png";
import { ShoppingCart } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white h-16 fixed w-full">
      <div className="container mx-auto flex items-center justify-between py-3 px-20">
        {/* Collection buttons */}
        <div className="collections flex space-x-4 gap-4">
          <button className="text-gray-700 hover:text-gray-900 uppercase cursor-pointer">
            All
          </button>
          <button className="text-gray-700 hover:text-gray-900 uppercase cursor-pointer">
            Clothing
          </button>
          <button className="text-gray-700 hover:text-gray-900 uppercase cursor-pointer">
            Tech
          </button>
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