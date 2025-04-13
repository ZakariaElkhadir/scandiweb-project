import { Link } from "react-router-dom";
import { ShoppingCart, Maximize } from "lucide-react";
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
  attributes?: {
    name: string;
    items: {
      value: string;
      display_value: string;
    }[];
  }[];
}

const ProductsCard = ({
  id,
  name,
  price,
  imageUrl,
  inStock,
  currency,
  attributes = [],
}: ProductProps) => {
  const { dispatch } = useCart(); // Access the dispatch function from the CartContext

  // Check if product has attributes that require selection (like size or color)
  const hasRequiredAttributes = attributes.some(
    (attr) => ["Size", "Color"].includes(attr.name) && attr.items.length > 0,
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasRequiredAttributes) {
      // If it has required attributes, we'll direct users to the product page
      // We could show a toast message explaining why
      toast.info(`Please select options for ${name}`);
      // Instead of changing the page, we'll let the Link component handle navigation
      return;
    }

    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id,
        name,
        image: imageUrl,
        price: numericPrice,
        currency,
        quantity: 1,
        attributes,
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

          {/* Action buttons that appear on hover */}
          {inStock !== undefined && inStock > 0 && (
            <div
              className="absolute z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                right-9 -bottom-6 flex gap-2"
            >
              {/* View details button for products with attributes */}
              {hasRequiredAttributes ? (
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Let the Link handle navigation
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white
                       rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
                  aria-label="View details"
                >
                  <Maximize className="w-5 h-5" strokeWidth={1.5} />
                </button>
              ) : (
                /* Add to cart button for products without required attributes */
                <button
                  onClick={handleAddToCart}
                  className="bg-green-500 hover:bg-green-600 text-white
                       rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
                  aria-label="Add to cart"
                >
                  <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
                </button>
              )}
            </div>
          )}

          {/* Out of Stock Badge */}
          {inStock === 0 && (
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-2 py-1 rounded">
              Out of Stock
            </span>
          )}

          {/* Optional: Show a "Select Options" label for products with attributes */}
          {hasRequiredAttributes && inStock !== 0 && (
            <span className="absolute bottom-0 left-0 bg-gray-800 text-white text-xs px-2 py-1">
              Select Options
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
