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
 * A  functional component that renders a product card with details such as name, price, image, and stock status.
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
  const hasRequiredAttributes = attributes.some(
    (attr) => ["Size", "Color"].includes(attr.name) && attr.items.length > 0
  );

  const kebabCase = (str: string) => str.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link to={`/product/${id}`} className="block w-full">
      <div
        data-testid={`product-${kebabCase(name)}`}
        className="w-full max-w-[386px] h-[444px] bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-shadow flex flex-col p-2 cursor-pointer group mx-auto"
      >
        <div className="relative overflow-visible h-[70%] w-full mb-2 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={name}
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
            className={`w-full h-full object-contain px-4 pt-4 
    group-hover:scale-105 group-hover:px-4 
    transition-all duration-300
    ${inStock === 0 ? "opacity-50 grayscale" : ""}`}
          />

          {inStock !== undefined && inStock > 0 && (
            <div
              className="absolute z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300
            right-9 -bottom-2 flex gap-2 "
            >
              {hasRequiredAttributes ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white
               rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
                  aria-label="View details"
                >
                  <Maximize className="w-5 h-5" strokeWidth={1.5} />
                </button>
              ) : (
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

          {inStock === 0 && (
            <span className="uppercase text-2xl text-[#75757a] absolute">
              Out of Stock
            </span>
          )}
        </div>

        <div className="mt-4 ml-4">
          <h4 className="text-lg font-[300] text-[#1D1F22] truncate font-raleway">
            {name}
          </h4>
          <p className="text-ll font-bold text-gray-900 font-raleway ">
            {currency}
            {price}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductsCard;
