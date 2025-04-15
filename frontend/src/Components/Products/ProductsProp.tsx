import { Link } from "react-router-dom";
import { ShoppingCart, Maximize } from "lucide-react";
import fallbackImage from "../../assets/images/fallback.jpg";


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

/**
 * A React functional component that renders a product card with details such as name, price, image, and stock status.
 * The card includes hover effects, action buttons, and conditional rendering based on product attributes and stock availability.
 *
 * @param {ProductProps} props - The properties passed to the component.
 * @param {string} props.id - The unique identifier for the product.
 * @param {string} props.name - The name of the product.
 * @param {string} props.price - The price of the product, formatted as a string.
 * @param {string} props.imageUrl - The URL of the product's image.
 * @param {number} props.inStock - The stock availability of the product. A value of 0 indicates out of stock.
 * @param {string} [props.currency] - The currency symbol for the product price. Defaults to "USD" if undefined.
 * @param {Array<{ name: string; items: Array<{ id: string; value: string }> }>} [props.attributes=[]] - 
 * An array of product attributes, such as size or color, that may require user selection.
 *
 * @returns {JSX.Element} A JSX element representing the product card.
 *
 * @remarks
 * - The component uses conditional rendering to display different UI elements based on the product's stock status
 *   and whether it has required attributes.
 * - Includes hover effects for action buttons and image scaling.
 * - Displays a fallback image if the provided image URL fails to load.
 */
const ProductsCard = ({
  id,
  name,
  price,
  imageUrl,
  inStock,
  currency,
  attributes = [],
}: ProductProps) => {
 // Access the dispatch function from the CartContext

  // Check if product has attributes that require selection (like size or color)
  const hasRequiredAttributes = attributes.some(
    (attr) => ["Size", "Color"].includes(attr.name) && attr.items.length > 0
  );

  // const handleAddToCart = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
  //   const resolvedCurrency = currency || "USD"; // Provide a default currency if undefined

  //   dispatch({
  //     type: "ADD_ITEM",
  //     payload: {
  //       id,
  //       name,
  //       image: imageUrl,
  //       price: numericPrice,
  //       currency: resolvedCurrency,
  //       quantity: 1,
  //     },
  //   });

  //   if (hasRequiredAttributes) {
  //     toast.info(`Please select options for ${name}`);

  //     return;
  //   }

  //   // Check if toast is initialized and use a try-catch to handle errors
  //   try {
  //     toast.success(`${name} added to cart!`, {
  //       position: "bottom-right",
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //     });
  //   } catch (error) {
  //     console.log(`Toast notification failed: ${name} added to cart!`);
  //   }
  // };

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
