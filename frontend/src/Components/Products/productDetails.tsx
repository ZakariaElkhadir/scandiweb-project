import { useState, useEffect } from "react";
import { useCart } from "../Cart/CartContext";
import { toast } from "react-toastify";
import { ArrowRight, ArrowLeft } from "lucide-react";
import parse from "html-react-parser";
import DOMPurify from "dompurify";

interface ProductDetailsProps {
  product: {
    id: string;
    name: string;
    images: string[];
    attributes: {
      id?: string;
      name: string;
      items: {
        id?: string;
        value: string;
        display_value: string;
      }[];
    }[];
    currency: {
      symbol: string;
    };
    price: number;
    description: string;
    in_stock: number | boolean;
    inStock: number | boolean;
  };
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [hoveredSizeIndex, setHoveredSizeIndex] = useState<number | null>(null);
  const [showAllThumbnails, setShowAllThumbnails] = useState(false);
  const { dispatch } = useCart();

  const groupedAttributes = (product.attributes || [])
    .filter((attr) => attr && attr.name)
    .reduce((groups, attr) => {
      const name = (attr.name || "unknown").toLowerCase();

      if (!groups[name]) {
        groups[name] = {
          name: attr.name || "Unknown",
          type: name,
          instances: [],
        };
      }

      groups[name].instances.push(attr);

      return groups;
    }, {} as Record<string, { name: string; type: string; instances: typeof product.attributes }>);

  useEffect(() => {
    const initialAttributes: Record<string, string> = {};

    Object.values(groupedAttributes).forEach((group) => {
      if (
        group.instances.length > 0 &&
        group.instances[0].items &&
        group.instances[0].items.length > 0
      ) {
        const firstInstance = group.instances[0];
        const key = firstInstance.id || group.type;
        initialAttributes[key] = firstInstance.items[0].value;
      }
    });

    setSelectedAttributes({});
  }, [product.id]);

  const getSizeAbbreviation = (displayValue: string): string => {
    if (!displayValue) return "";

    const lowerValue = displayValue.toLowerCase();
    if (lowerValue === "small") return "S";
    if (lowerValue === "medium") return "M";
    if (lowerValue === "large") return "L";
    if (lowerValue === "extra large") return "XL";
    if (lowerValue === "extra small") return "XS";
    if (lowerValue === "2x large" || lowerValue === "xx large") return "2XL";
    if (lowerValue === "3x large" || lowerValue === "xxx large") return "3XL";
    return displayValue;
  };

  const handleAttributeSelect = (attributeId: string, value: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeId]: value,
    }));
  };

  const visibleThumbnails = showAllThumbnails
    ? product.images || []
    : (product.images || []).slice(0, 4);

  const handleAddToCart = () => {
    const unselectedTypes = Object.values(groupedAttributes)
      .filter(
        (group) =>
          group.instances.length > 0 &&
          group.instances[0].items &&
          group.instances[0].items.length > 0 &&
          !group.instances.some(
            (attr) => selectedAttributes[attr.id || group.type]
          )
      )
      .map((group) => group.name);

    if (unselectedTypes.length > 0) {
      toast.error(
        `Please select ${unselectedTypes.join(", ")} for ${product.name}`
      );
      return;
    }

    const attributeSelections: Record<string, string> = {};

    Object.entries(selectedAttributes).forEach(([key, value]) => {
      const attributeType = Object.values(groupedAttributes).find((group) =>
        group.instances.some((attr) => (attr.id || group.type) === key)
      );

      if (attributeType) {
        const type = attributeType.type;

        if (type === "size") {
          attributeSelections.selectedSize = value;
        } else if (type === "color") {
          attributeSelections.selectedColor = value;
        } else if (type === "capacity") {
          attributeSelections.selectedCapacity = value;
        } else {
          const camelCaseName = `selected${
            attributeType.name.charAt(0).toUpperCase() +
            attributeType.name.slice(1)
          }`;
          attributeSelections[camelCaseName] = value;
        }
      }
    });

    toast.success(`${product.name} added to cart successfully!`);

    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images?.[selectedImage] || "",
        currency: product.currency?.symbol || "$",
        attributes: product.attributes,
        ...attributeSelections,
      },
    });
    window.dispatchEvent(new CustomEvent("openCartOverlay"));
  };
  const sanitizedDescription = DOMPurify.sanitize(product.description || "");
  const areAllAttributesSelected = () => {
    const unselectedTypes = Object.values(groupedAttributes).filter(
      (group) =>
        group.instances.length > 0 &&
        group.instances[0].items &&
        group.instances[0].items.length > 0 &&
        !group.instances.some(
          (attr) => selectedAttributes[attr.id || group.type]
        )
    );

    return unselectedTypes.length === 0;
  };
  return (
    <div className="flex flex-col md:flex-row gap-4 lg:gap-8 max-w-6xl mx-auto p-4 pt-20">
      {/* Image Gallery - Mobile version  */}
      <div className="md:hidden w-full mb-4 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {(product.images || []).map((image, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-20 h-20 cursor-pointer border ${
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
      </div>

      {/* Left side - Images for tablet/desktop */}
      <div
        className="hidden md:block md:w-1/2 lg:w-3/5"
        data-testid="product-gallery"
      >
        <div className="flex h-full">
          {/* Thumbnails column */}
          <div className="hidden md:flex flex-col gap-2 mr-4">
            {visibleThumbnails.map((image, index) => (
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

            {/* Show more button if there are more than 4 images */}
            {(product.images?.length || 0) > 4 && !showAllThumbnails && (
              <button
                className="text-xs text-gray-600 hover:text-black underline"
                onClick={() => setShowAllThumbnails(true)}
              >
                +{(product.images?.length || 0) - 4} more
              </button>
            )}
          </div>

          {/* Main image with fixed aspect ratio container */}
          <div className="flex-1">
            <div className="relative w-full h-0 pb-[100%]">
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <img
                  src={product.images?.[selectedImage] || ""}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
                {product.images && product.images.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-2">
                    <button
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev > 0
                            ? prev - 1
                            : (product.images?.length || 1) - 1
                        )
                      }
                      className="rounded-sm p-2 shadow-md cursor-pointer z-10"
                      style={{
                        backgroundColor: "rgba(156, 163, 175, 0.7)",
                      }}
                      aria-label="Previous image"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev < (product.images?.length || 1) - 1
                            ? prev + 1
                            : 0
                        )
                      }
                      className="rounded-sm p-2 shadow-md cursor-pointer z-10"
                      style={{
                        backgroundColor: "rgba(156, 163, 175, 0.7)",
                      }}
                      aria-label="Next image"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main image for mobile with fixed aspect ratio */}
      <div className="md:hidden w-full mb-4">
        <div className="relative w-full h-0 pb-[100%] bg-gray-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={product.images?.[selectedImage] || ""}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
            {product.images && product.images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-2">
                <button
                  onClick={() =>
                    setSelectedImage((prev) =>
                      prev > 0 ? prev - 1 : (product.images?.length || 1) - 1
                    )
                  }
                  className="rounded-sm p-2 shadow-md cursor-pointer z-10"
                  style={{
                    backgroundColor: "rgba(156, 163, 175, 0.7)",
                  }}
                  aria-label="Previous image"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  onClick={() =>
                    setSelectedImage((prev) =>
                      prev < (product.images?.length || 1) - 1 ? prev + 1 : 0
                    )
                  }
                  className="rounded-sm p-2 shadow-md cursor-pointer z-10"
                  style={{
                    backgroundColor: "rgba(156, 163, 175, 0.7)",
                  }}
                  aria-label="Next image"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right side - Product details */}
      <div className="md:w-1/2 lg:w-2/5 space-y-4">
        <h1 className="text-xl sm:text-2xl font-medium">{product.name}</h1>

        {Object.values(groupedAttributes).map((group) => {
          if (
            !group.instances.length ||
            !group.instances[0].items ||
            !group.instances[0].items.length
          ) {
            return null;
          }

          const firstInstance = group.instances[0];
          const attributeId = firstInstance.id || group.type;

          return (
            <div
              key={group.type}
              className="mb-4"
              data-testid={`product-attribute-${group.type}`}
            >
              <p className="text-sm font-medium uppercase mb-2">
                {group.name}:
              </p>

              <div className="flex flex-wrap gap-2">
                {group.type === "size" &&
                  firstInstance.items.map((item, index) => (
                    <div
                      key={item.id || item.value || index}
                      className="relative"
                    >
                      <button
                        data-testid={`product-attribute-size-${item.value}`}
                        className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border text-sm font-medium ${
                          selectedAttributes[attributeId] === item.value
                            ? "border-black bg-black text-white"
                            : "border-gray-300 hover:border-gray-500"
                        }`}
                        onClick={() =>
                          handleAttributeSelect(attributeId, item.value)
                        }
                        onMouseEnter={() => setHoveredSizeIndex(index)}
                        onMouseLeave={() => setHoveredSizeIndex(null)}
                      >
                        {getSizeAbbreviation(item.display_value)}
                      </button>

                      {hoveredSizeIndex === index && (
                        <div className="hidden sm:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap">
                          {item.display_value}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                        </div>
                      )}
                    </div>
                  ))}

                {group.type === "color" &&
                  firstInstance.items.map((item, index) => (
                    <button
                      key={item.id || item.value || index}
                      data-testid={`product-attribute-color-${item.value}`}
                      className={`w-6 h-6 rounded-sm ${
                        selectedAttributes[attributeId] === item.value
                          ? "ring-2 ring-black ring-offset-1"
                          : ""
                      }`}
                      style={{ backgroundColor: item.value }}
                      onClick={() =>
                        handleAttributeSelect(attributeId, item.value)
                      }
                      title={item.display_value}
                      aria-label={`Color: ${item.display_value}`}
                    />
                  ))}

                {group.type === "capacity" &&
                  firstInstance.items.map((item, index) => (
                    <button
                      key={item.id || item.value || index}
                      data-testid={`product-attribute-capacity-${item.value}`}
                      className={`px-3 py-1 border ${
                        selectedAttributes[attributeId] === item.value
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-gray-500"
                      }`}
                      onClick={() =>
                        handleAttributeSelect(attributeId, item.value)
                      }
                    >
                      {item.display_value}
                    </button>
                  ))}

                {group.type !== "size" &&
                  group.type !== "color" &&
                  group.type !== "capacity" &&
                  firstInstance.items.map((item, index) => (
                    <button
                      key={item.id || item.value || index}
                      data-testid={`product-attribute-${group.type}-${item.value}`}
                      className={`px-3 py-1 border ${
                        selectedAttributes[attributeId] === item.value
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-gray-500"
                      }`}
                      onClick={() =>
                        handleAttributeSelect(attributeId, item.value)
                      }
                    >
                      {item.display_value}
                    </button>
                  ))}
              </div>
            </div>
          );
        })}

        <div className="mb-4">
          <p className="text-sm font-medium uppercase mb-2">PRICE:</p>
          <p className="text-lg font-medium">
            {product.currency?.symbol || "$"}
            {(product.price || 0).toFixed(2)}
          </p>
        </div>

        <button
          className={`w-full py-3 px-4 transition text-sm sm:text-base ${
            Boolean(product.in_stock || product.inStock) &&
            areAllAttributesSelected()
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
          data-testid="add-to-cart"
          disabled={
            !Boolean(product.in_stock || product.inStock) ||
            !areAllAttributesSelected()
          }
          onClick={handleAddToCart}
        >
          ADD TO CART
        </button>
        <div
          className="text-xs sm:text-sm prose prose-sm max-w-none text-gray-500 mt-6 overflow-auto"
          data-testid="product-description"
        >
          {parse(sanitizedDescription)}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
