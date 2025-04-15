import { useCart } from "./CartContext";
import { useState } from "react";

const CartOverlay = ({ onClose }: { onClose: () => void }) => {
  const { state, dispatch } = useCart();
  const [hoveredSizeIndex, setHoveredSizeIndex] = useState<{
    itemId: string;
    index: number;
  } | null>(null);

  const totalPrice = state.items.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  // Abbreviated size label helper function
  const getSizeAbbreviation = (displayValue: string): string => {
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

  const handleAttributeChange = (
    itemId: string,
    attributeName: string,
    value: string
  ) => {
    dispatch({
      type: "UPDATE_ITEM_ATTRIBUTES",
      payload: {
        id: itemId,
        attributeName,
        value,
      },
    });
  };

  return (
    <>
      {/* Grey overlay that covers everything except header */}
      <div
        className="fixed inset-0 top-16 z-10"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
        onClick={onClose}
      />

      {/* Cart content */}
      <div className="fixed top-16 right-0 w-96 bg-white max-h-[calc(100vh-4rem)] p-4 shadow-lg z-20 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">
          My Bag, {state.items.length}{" "}
          {state.items.length === 1 ? "Item" : "Items"}
        </h2>
        <div className="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {state.items.map((item) => (
            <div
              key={`${item.id}-${item.selectedSize || "default"}-${
                item.selectedColor || "default"
              }`}
              className="flex gap-4 pb-4 border-b border-gray-200"
            >
              <div className="flex flex-col justify-between">
                <button
                  data-testid="cart-item-amountincrease"
                  className="w-6 h-6 border border-gray-200 flex items-center justify-center text-lg"
                  onClick={() =>
                    dispatch({
                      type: "UPDATE_ITEM",
                      payload: {
                        id: item.id,
                        cartItemId: item.cartItemId,
                        quantity: item.quantity + 1,
                      },
                    })
                  }
                >
                  +
                </button>
                <span
                  data-testid="cart-item-amount"
                  className="text-center py-1"
                >
                  {item.quantity}
                </span>
                <button
                  data-testid="cart-item-amountdecrease"
                  className="w-6 h-6 border border-gray-200 flex items-center justify-center text-lg"
                  onClick={() =>
                    dispatch({
                      type: "UPDATE_ITEM",
                      payload: {
                        id: item.id,
                        cartItemId: item.cartItemId,
                        quantity: Math.max(0, item.quantity - 1),
                      },
                    })
                  }
                >
                  -
                </button>
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-medium">{item.name}</h3>
                <p className="text-sm font-medium mt-1">
                  {item.currency} {(item.price || 0).toFixed(2)}
                </p>

                {/* Size attribute */}
                {item.attributes?.some((attr) => attr.name === "Size") && (
                  <div data-testid="cart-itemattribute-size" className="mt-2">
                    <p className="text-xs font-medium mb-1">SIZE:</p>
                    <div className="flex gap-1">
                      {item.attributes
                        .find((attr) => attr.name === "Size")
                        ?.items.map((sizeItem, index) => (
                          <div key={sizeItem.value} className="relative">
                            <button
                              data-testid={
                                item.selectedSize === sizeItem.value
                                  ? `cart-itemattribute-size-${sizeItem.value
                                      .toLowerCase()
                                      .replace(/\s+/g, "-")}-selected`
                                  : `cart-itemattribute-size-${sizeItem.value
                                      .toLowerCase()
                                      .replace(/\s+/g, "-")}`
                              }
                              className={`w-6 h-6 flex items-center justify-center border text-xs ${
                                item.selectedSize === sizeItem.value
                                  ? "border-black bg-black text-white"
                                  : "border-gray-300"
                              }`}
                              onClick={() =>
                                handleAttributeChange(
                                  item.id,
                                  "Size",
                                  sizeItem.value
                                )
                              }
                              onMouseEnter={() =>
                                setHoveredSizeIndex({ itemId: item.id, index })
                              }
                              onMouseLeave={() => setHoveredSizeIndex(null)}
                            >
                              {getSizeAbbreviation(sizeItem.display_value)}
                            </button>

                            {/* Tooltip */}
                            {hoveredSizeIndex?.itemId === item.id &&
                              hoveredSizeIndex?.index === index && (
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-black text-white text-xs rounded whitespace-nowrap z-30">
                                  {sizeItem.display_value}
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-black"></div>
                                </div>
                              )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Color attribute */}
                {item.attributes?.some((attr) => attr.name === "Color") && (
                  <div data-testid="cart-itemattribute-color" className="mt-2">
                    <p className="text-xs font-medium mb-1">COLOR:</p>
                    <div className="flex gap-1">
                      {item.attributes
                        .find((attr) => attr.name === "Color")
                        ?.items.map((colorItem) => (
                          <button
                            key={colorItem.value}
                            data-testid={
                              item.selectedColor === colorItem.value
                                ? `cart-itemattribute-color-${colorItem.value
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}-selected`
                                : `cart-itemattribute-color-${colorItem.value
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}`
                            }
                            className={`w-5 h-5 rounded-sm ${
                              item.selectedColor === colorItem.value
                                ? "ring-1 ring-black ring-offset-1"
                                : ""
                            }`}
                            style={{ backgroundColor: colorItem.value }}
                            onClick={() =>
                              handleAttributeChange(
                                item.id,
                                "Color",
                                colorItem.value
                              )
                            }
                            title={colorItem.display_value}
                          />
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover"
              />
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <p className="text-base font-semibold">Total:</p>
          <p data-testid="cart-total" className="text-base font-semibold">
            {state.items[0]?.currency || "$"} {totalPrice.toFixed(2)}
          </p>
        </div>
        <div className="mt-4">
          <button
            className={`w-full py-2 ${
              state.items.length > 0
                ? "bg-green-500 text-white"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
            disabled={state.items.length === 0}
            onClick={() => console.log("Place Order")}
          >
            Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default CartOverlay;
