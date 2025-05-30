import { useCart } from "./CartContext";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const CartOverlay = ({ onClose }: { onClose: () => void }) => {
  const [apiEndpoint, setApiEndpoint] = useState("/graphql");
  useEffect(() => {
    const endpoint = import.meta.env.PROD
      ? `${import.meta.env.VITE_BACKEND_URL}/graphql`
      : "/graphql";
    setApiEndpoint(endpoint);
  }, []);

  const CREATE_ORDER_MUTATION = `
    mutation CreateOrder($customerEmail: String!, $shippingAddress: String!, $items: [OrderItemInput!]!) {
      createOrder(
        customerEmail: $customerEmail,
        shippingAddress: $shippingAddress,
        items: $items
      ) {
        success
        message
        orderId
      }
    }
  `;

  const { state, dispatch } = useCart();
  const [hoveredSizeIndex, setHoveredSizeIndex] = useState<{
    itemId: string;
    index: number;
  } | null>(null);

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerEmail] = useState("example@gmail.com");
  const [shippingAddress] = useState("california, 1234, USA");

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

  const getSelectedAttributeValue = (item: any, attributeName: string) => {
    if (attributeName === "Size") return item.selectedSize;
    if (attributeName === "Color") return item.selectedColor;
    if (attributeName === "Capacity") return item.selectedCapacity;

    const camelCaseKey = `selected${
      attributeName.charAt(0).toUpperCase() + attributeName.slice(1)
    }`;
    return item[camelCaseKey];
  };

  const handleCheckout = async () => {
    if (state.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsCheckingOut(true);

    const orderItems = state.items.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: CREATE_ORDER_MUTATION,
          variables: {
            customerEmail,
            shippingAddress,
            items: orderItems,
          },
        }),
      });

      const json = await res.json();

      if (json.data && json.data.createOrder) {
        const { success, message, orderId } = json.data.createOrder;

        if (success) {
          toast.success(`Order #${orderId} placed successfully!`);
          // Clear the entire cart after checkout
          dispatch({ type: "CLEAR_CART" });
          onClose();
        } else {
          toast.error("Failed to place order: " + message);
        }
      } else if (json.errors) {
        toast.error("Error: " + json.errors[0].message);
        console.error("GraphQL Errors:", json.errors);
      } else {
        toast.error("An unknown error occurred");
        console.error("Unexpected response:", json);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };



  // Make sure the event propagation is handled correctly for clicks
  const handleCartClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <>
      {/* Grey overlay that covers everything except header */}
      <div
        className="fixed inset-0 top-16 z-10"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
        onClick={handleCartClose}
      />

      {/* Cart content */}
      <div
        className="fixed top-16 right-0 w-96 bg-white max-h-[calc(100vh-4rem)] p-4 shadow-lg z-20 flex flex-col"
        data-testid="cart-overlay"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">
          My Bag, {state.items.length}{" "}
          {state.items.length === 1 ? "Item" : "Items"}
        </h2>

        <div className="max-h-[calc(100vh-240px)] overflow-y-auto">
          {state.items.map((item) => {
            // Process attributes to avoid duplicates
            const uniqueAttributes = item.attributes
              ? item.attributes.reduce(
                  (uniqueAttrs: Record<string, any>, attr) => {
                    if (!attr || !attr.name) return uniqueAttrs;
                    const lowerName = attr.name.toLowerCase();
                    // Only add if not already present
                    if (!uniqueAttrs[lowerName]) {
                      uniqueAttrs[lowerName] = attr;
                    }
                    return uniqueAttrs;
                  },
                  {}
                )
              : {};

            return (
              <div
                key={item.cartItemId}
                className="flex gap-4 pb-4 mb-4 border-b border-gray-200"
              >
               

                <div className="flex-1">
                  <h3 className="text-sm font-medium">{item.name}</h3>
                  <p className="text-sm font-medium mt-1">
                    {item.currency} {(item.price || 0).toFixed(2)}
                  </p>

                  {/* Render unique attributes */}
                  {Object.values(uniqueAttributes).map((attr: any) => {
                    if (!attr || !attr.name || !attr.items) return null;

                    const attrName = attr.name;
                    const attrNameLower = attrName.toLowerCase();
                    const selectedValue = getSelectedAttributeValue(
                      item,
                      attrName
                    );

                    return (
                      <div
                        key={attrName}
                        data-testid={`cart-itemattribute-${attrNameLower}`}
                        className="mt-2"
                      >
                        <p className="text-xs font-medium mb-1">
                          {attrName.toUpperCase()}:
                        </p>

                        <div className="flex gap-1">
                          {attrNameLower === "size" &&
                            attr.items.map((sizeItem: any, index: number) => (
                              <div key={sizeItem.value} className="relative">
                                <div
                                  data-testid={
                                    selectedValue === sizeItem.value
                                      ? `cart-itemattribute-size-${sizeItem.value
                                          .toLowerCase()
                                          .replace(/\s+/g, "-")}-selected`
                                      : `cart-itemattribute-size-${sizeItem.value
                                          .toLowerCase()
                                          .replace(/\s+/g, "-")}`
                                  }
                                  className={`w-6 h-6 flex items-center justify-center border text-xs cursor-default ${
                                    selectedValue === sizeItem.value
                                      ? "border-black bg-black text-white"
                                      : "border-gray-300"
                                  }`}
                                  onMouseEnter={() =>
                                    setHoveredSizeIndex({
                                      itemId: item.id,
                                      index,
                                    })
                                  }
                                  onMouseLeave={() => setHoveredSizeIndex(null)}
                                >
                                  {getSizeAbbreviation(sizeItem.display_value)}
                                </div>

                                {hoveredSizeIndex?.itemId === item.id &&
                                  hoveredSizeIndex?.index === index && (
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-black text-white text-xs rounded whitespace-nowrap z-30">
                                      {sizeItem.display_value}
                                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-black"></div>
                                    </div>
                                  )}
                              </div>
                            ))}

                          {attrNameLower === "color" &&
                            attr.items.map((colorItem: any) => (
                              <div
                                key={colorItem.value}
                                data-testid={
                                  selectedValue === colorItem.value
                                    ? `cart-itemattribute-color-${colorItem.value
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}-selected`
                                    : `cart-itemattribute-color-${colorItem.value
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}`
                                }
                                className={`w-5 h-5 rounded-sm cursor-default ${
                                  selectedValue === colorItem.value
                                    ? "ring-1 ring-black ring-offset-1"
                                    : ""
                                }`}
                                style={{ backgroundColor: colorItem.value }}
                                title={colorItem.display_value}
                              />
                            ))}

                          {attrNameLower !== "size" &&
                            attrNameLower !== "color" &&
                            attr.items.map((attrItem: any) => (
                              <div
                                key={attrItem.value}
                                data-testid={
                                  selectedValue === attrItem.value
                                    ? `cart-itemattribute-${attrNameLower}-${attrItem.value
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}-selected`
                                    : `cart-itemattribute-${attrNameLower}-${attrItem.value
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}`
                                }
                                className={`px-2 py-1 border text-xs cursor-default ${
                                  selectedValue === attrItem.value
                                    ? "border-black bg-black text-white"
                                    : "border-gray-300"
                                }`}
                              >
                                {attrItem.display_value}
                              </div>
                            ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
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
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover"
                />
              </div>
            );
          })}
        </div>

        <div className="mt-auto">
          <div className="flex justify-between items-center mb-4">
            <p className="text-base font-semibold">Total:</p>
            <p data-testid="cart-total" className="text-base font-semibold">
              {state.items[0]?.currency || "$"} {totalPrice.toFixed(2)}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              className={`flex-1 py-2 ${
                state.items.length > 0
                  ? "bg-green-500 text-white cursor-pointer"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
              disabled={state.items.length === 0 || isCheckingOut}
              onClick={handleCheckout}
            >
              {isCheckingOut ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartOverlay;
