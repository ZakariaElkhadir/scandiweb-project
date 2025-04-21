import React, { createContext, useContext, useReducer, useEffect } from "react";

// Cart item interface - includes product attributes
interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  currency: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  selectedCapacity?: string;
  attributes?: {
    name: string;
    items: {
      value: string;
      display_value: string;
    }[];
  }[];
  cartItemId?: string;
  [key: string]: any; // Allow for dynamic attribute properties
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem | CartItem[] }
  | {
      type: "UPDATE_ITEM";
      payload: { id: string; cartItemId?: string; quantity: number };
    }
  | {
      type: "UPDATE_ITEM_ATTRIBUTES";
      payload: {
        id: string;
        attributeName: string;
        value: string;
      };
    }
  | { type: "CLEAR_CART" };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

// Helper function to convert attribute name to camelCase selected property
const attributeNameToProperty = (attributeName: string): string => {
  if (attributeName === "Size") return "selectedSize";
  if (attributeName === "Color") return "selectedColor";
  if (attributeName === "Capacity") return "selectedCapacity";
  // For other attributes, convert to camelCase
  return `selected${
    attributeName.charAt(0).toUpperCase() + attributeName.slice(1)
  }`;
};

// Generate a unique ID for cart items based on all selected attributes
const generateCartItemId = (item: CartItem): string => {
  // Start with the product ID
  let idParts = [item.id];

  // Find all selected attribute properties
  const attributeProps = Object.keys(item).filter(
    (key) => key.startsWith("selected") && item[key]
  );

  // Sort to ensure consistent ID generation
  attributeProps.sort();

  // Add each selected attribute to the ID
  attributeProps.forEach((prop) => {
    idParts.push(`${prop}:${item[prop]}`);
  });

  return idParts.join("_");
};

/**
 * Reducer function to manage the state of the shopping cart.
 */
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM":
      // Handle both single item and array of items
      if (Array.isArray(action.payload)) {
        // Generate unique IDs for all items in the array
        const itemsWithIds = action.payload.map((item) => ({
          ...item,
          cartItemId: generateCartItemId(item),
        }));
        return { items: [...state.items, ...itemsWithIds] };
      }

      // Generate a unique ID for this item based on product ID and all selected attributes
      const newItem = {
        ...action.payload,
        cartItemId: generateCartItemId(action.payload),
      };

      // Find if we already have this item with the same attributes
      const existingItemIndex = state.items.findIndex(
        (item) => item.cartItemId === newItem.cartItemId
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return { items: updatedItems };
      }

      return { items: [...state.items, newItem] };

    case "UPDATE_ITEM":
      //  cartItemId for the update if available, otherwise fallback to id
      const updatedItems = state.items
        .map((item) => {
          // Check by cartItemId (which includes attribute info) instead of just product id
          if (
            action.payload.cartItemId &&
            item.cartItemId === action.payload.cartItemId
          ) {
            return { ...item, quantity: action.payload.quantity };
          } else if (
            !action.payload.cartItemId &&
            item.id === action.payload.id
          ) {
            return { ...item, quantity: action.payload.quantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0); // Automatically remove items with quantity 0

      return { items: updatedItems };

    case "UPDATE_ITEM_ATTRIBUTES":
      // Find the specific item to update
      const { id, attributeName, value } = action.payload;

      // Find the item we want to modify
      const itemToUpdate = state.items.find((item) => item.id === id);

      if (!itemToUpdate) return state;

      // Create a copy of the item with updated attribute
      const updatedItem = { ...itemToUpdate };

      // Convert attribute name to property name and update
      const propertyName = attributeNameToProperty(attributeName);
      updatedItem[propertyName] = value;

      // Generate a new cart item ID with the updated attributes
      updatedItem.cartItemId = generateCartItemId(updatedItem);

      // Check if we already have an item with these exact attributes
      const duplicateItem = state.items.find(
        (item) =>
          item.cartItemId === updatedItem.cartItemId && item !== itemToUpdate
      );

      if (duplicateItem) {
        // If a duplicate exists, increase its quantity and remove the original
        return {
          items: state.items
            .map((item) => {
              if (item.cartItemId === duplicateItem.cartItemId) {
                return {
                  ...item,
                  quantity: item.quantity + itemToUpdate.quantity,
                };
              } else if (item === itemToUpdate) {
                // This item will be filtered out later
                return { ...item, quantity: 0 };
              }
              return item;
            })
            .filter((item) => item.quantity > 0),
        };
      } else {
        // Otherwise just update the attribute and cart item ID
        return {
          items: state.items.map((item) => {
            if (item === itemToUpdate) {
              return updatedItem;
            }
            return item;
          }),
        };
      }
    case "CLEAR_CART":
      return { items: [] };

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        let parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          parsedCart.forEach((item) => {
            if (typeof item.price === "string") {
              item.price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
            }
            if (!item.price || isNaN(item.price)) {
              item.price = 0;
            }
          });
          parsedCart = parsedCart.filter((item) => !isNaN(item.price));
          dispatch({ type: "ADD_ITEM", payload: parsedCart });
        }
      } catch (error) {
        console.error("Failed to parse cart data:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
