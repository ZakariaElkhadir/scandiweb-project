import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import fallbackImage from "../../assets/images/fallback.jpg";
import { useCart } from "../Cart/CartContext";
import { toast } from "react-toastify"; 
interface ProductProps {
  id: string;
  imageUrl: string;
  name: string;
  price: string;
  inStock?: number;
  currency?: string;
}

const ProductsCard = ({
  id,
  name,
  price,
  imageUrl,
  inStock,
  currency = "$", // Default currency
}: ProductProps) => {
  const { dispatch } = useCart(); // Access the dispatch function from the CartContext

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
  
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id,
        name,
        image: imageUrl,
        price: parseFloat(price),
        currency,
        quantity: 1,
      },
    });
  
    toast.success(`${name} added to cart!`);
  };

  const kebabCase = (str: string) => str.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link to={`/product/${id}`} className="block">
      <div
        data-testid={`product-${kebabCase(name)}`}
        className="w-64 h-72 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col p-2 cursor-pointer group"
      >
        <div className="relative overflow-visible h-48 w-full mb-3 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={name}
            onError={(e) => {
              e.currentTarget.src = fallbackImage; // Local fallback image
            }}
            className={`w-full h-full object-contain group-hover:scale-105 transition-transform duration-300
              ${inStock === 0 ? "opacity-50 grayscale" : ""}`}
          />

          {/* Cart button that appears on hover */}
          {inStock !== undefined && inStock > 0 && (
            <button
              onClick={handleAddToCart}
              className="absolute z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                   -bottom-6 right-9 transform translate-x-1/2
                   bg-green-500 hover:bg-green-600 text-white
                   rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-6 h-6" strokeWidth={1.5} />
            </button>
          )}

          {/* Out of Stock Badge */}
          {inStock === 0 && (
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-2 py-1 rounded">
              Out of Stock
            </span>
          )}
        </div>

        <div className="mt-auto">
          <h4 className="text-lg font-medium text-gray-800 mb-1 truncate">
            {name}
          </h4>
          <p className="text-xl font-bold text-gray-900">
            {currency}
            {price}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductsCard;
