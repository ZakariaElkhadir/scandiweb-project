import { useState } from "react";
import { useCart } from "../Cart/CartContext";
import { toast } from "react-toastify";

interface ProductDetailsProps {
  product: {
    id: string; // Make sure product has an ID
    name: string;
    images: string[];
    attributes: {
      name: string;
      items: {
        value: string;
        display_value: string;
      }[];
    }[];
    currency: {
      symbol: string;
    };
    price: number;
    description: string;
    in_stock: number;
  };
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [hoveredSizeIndex, setHoveredSizeIndex] = useState<number | null>(null);
  const { dispatch } = useCart();

  // Find size and color attributes
  const sizeAttribute = product.attributes.find((attr) => attr.name === "Size");
  const colorAttribute = product.attributes.find(
    (attr) => attr.name === "Color",
  );

  // Abbreviated size label
  const getSizeAbbreviation = (displayValue: string): string => {
    const lowerValue = displayValue.toLowerCase();
    if (lowerValue === "small") return "S";
    if (lowerValue === "medium") return "M";
    if (lowerValue === "large") return "L";
    if (lowerValue === "extra large") return "XL";
    if (lowerValue === "extra small") return "XS";
    if (lowerValue === "2x large" || lowerValue === "xx large") return "2XL";
    if (lowerValue === "3x large" || lowerValue === "xxx large") return "3XL";
    // If no match, returning the original value
    return displayValue;
  };

  // Add to cart handler
  const handleAddToCart = () => {
    if ((product.in_stock ?? 0) <= 0) return;

    // Check if size is selected when needed
    if (sizeAttribute && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
  
    // Check if color is selected when needed
    if (colorAttribute && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    // Dispatch to cart
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[selectedImage], // Use the selected image
        currency: product.currency.symbol,
        attributes: product.attributes, // Include all attributes for later modification
        selectedSize: selectedSize,
        selectedColor: selectedColor,
      },
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto p-4">
      {/* Left side - Images */}
      <div className="flex md:w-1/2" data-testid="product-gallery">
        <div className="flex flex-col gap-2 mr-2">
          {product.images.map((image, index) => (
            <div
              key={index}
              className={`w-16 h-16 cursor-pointer border ${
                selectedImage === index ? "border-black" : "border-gray-200"
              }`}
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={image}
                alt={`${product.name} thumbnail ${index}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <div className="flex-1 relative">
          <img
            src={product.images[selectedImage]}
            alt={product.name}
            className="w-full object-cover"
          />
        </div>
      </div>

      {/* Right side - Product details */}
      <div className="md:w-1/2">
        <h1 className="text-2xl font-medium mb-6">{product.name}</h1>

        {/* Size selection - With popup hover effect */}
        {sizeAttribute && (
          <div
            className="mb-4"
            data-testid={`product-attribute-${sizeAttribute.name
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            <p className="text-sm font-medium uppercase mb-2">SIZE:</p>
            <div className="flex gap-2">
              {sizeAttribute.items.map((item, index) => (
                <div key={item.value} className="relative">
                  <button
                    className={`w-10 h-10 flex items-center justify-center border text-sm font-medium ${
                      selectedSize === item.value
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-gray-500"
                    }`}
                    onClick={() => setSelectedSize(item.value)}
                    onMouseEnter={() => setHoveredSizeIndex(index)}
                    onMouseLeave={() => setHoveredSizeIndex(null)}
                  >
                    {getSizeAbbreviation(item.display_value)}
                  </button>

                  {/* Popup tooltip */}
                  {hoveredSizeIndex === index && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap">
                      {item.display_value}
                      {/* Arrow pointing down */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Color selection */}
        {colorAttribute && (
          <div
            className="mb-4"
            data-testid={`product-attribute-${colorAttribute.name
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            <p className="text-sm font-medium uppercase mb-2">COLOR:</p>
            <div className="flex gap-2">
              {colorAttribute.items.map((item) => (
                <button
                  key={item.value}
                  className={`w-6 h-6 rounded-sm ${
                    selectedColor === item.value
                      ? "ring-2 ring-black ring-offset-1"
                      : ""
                  }`}
                  style={{ backgroundColor: item.value }}
                  onClick={() => setSelectedColor(item.value)}
                  title={item.display_value}
                />
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="mb-4">
          <p className="text-sm font-medium uppercase mb-2">PRICE:</p>
          <p className="text-lg font-medium">
            {product.currency.symbol}
            {product.price.toFixed(2)}
          </p>
        </div>

        {/* Add to cart button */}
        <button
          className={`w-full py-3 px-4 mt-4 transition ${
            (product.in_stock ?? 0) > 0
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
          data-testid="add-to-cart"
          disabled={(product.in_stock ?? 0) <= 0}
          onClick={handleAddToCart}
        >
          {(product.in_stock ?? 0) > 0 ? "ADD TO CART" : "OUT OF STOCK"}
        </button>

        {/* Product description */}
        <div
          className="text-xs prose text-gray-500 mt-6"
          data-testid="product-description"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
