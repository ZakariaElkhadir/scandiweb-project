import { ShoppingCart } from "lucide-react";

/**
 * Product Card displays: product image, name, price, and stock status
 * Product Price is formatted with 2 decimal places
 */
interface ProductProps {
  imageUrl: string;
  name: string;
  price: string;
  onAddToCart?: () => void;
  inStock?: number;
  currency?: string;
}

const ProductsCard = ({ 
  name, 
  price, 
  imageUrl, 
  inStock,
  onAddToCart: propOnAddToCart 
}: ProductProps) => {
  const handleAddToCart = () => {
    if (propOnAddToCart) {
      propOnAddToCart();
    } else {
      console.log("Add to cart clicked");
    }
  };

  return (
    <div className="w-64 h-72 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col p-2 cursor-pointer group">
      <div className="relative overflow-hidden h-48 w-full mb-3 flex items-center justify-center">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
        />
        {inStock === 0 && (
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-2 py-1 rounded">
            Out of Stock
          </span>
        )}
      </div>
      
      {/* Fixed spacing with consistent height regardless of stock status */}
      <div className="h-10 relative flex justify-end mb-2">
        {inStock !== undefined && inStock > 0 && (
          <button
            onClick={handleAddToCart}
            className="w-10 h-10 rounded-full bg-green-500 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ShoppingCart width={20} color="white" />
          </button>
        )}
      </div>
      
      <div className="mt-auto">
        <h4 className="text-lg font-medium text-gray-800 mb-1 truncate">
          {name}
        </h4>
        <p className="text-xl font-bold text-gray-900">{price}</p>
      </div>
    </div>
  );
};

export default ProductsCard;