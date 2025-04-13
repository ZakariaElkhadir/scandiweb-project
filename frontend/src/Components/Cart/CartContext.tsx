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
  attributes?: {
    name: string;
    items: {
      value: string;
      display_value: string;
    }[];
  }[];
}

interface CartState {
  items: CartItem[];
}

// Extended CartAction to include UPDATE_ITEM_ATTRIBUTES
type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem | CartItem[] }
  | { type: "UPDATE_ITEM"; payload: { id: string; quantity: number } }
  | {
      type: "UPDATE_ITEM_ATTRIBUTES";
      payload: {
        id: string;
        attributeName: string;
        value: string;
      };
    };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM":
      // Handle both single item and array of items
      if (Array.isArray(action.payload)) {
        return { items: [...state.items, ...action.payload] };
      }

      // Find if we already have this item with the same attributes
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.id === action.payload.id &&
          item.selectedSize === action.payload.selectedSize &&
          item.selectedColor === action.payload.selectedColor,
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return { items: updatedItems };
      }

      return { items: [...state.items, action.payload] };

    case "UPDATE_ITEM":
      const updatedItems = state.items
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item,
        )
        .filter((item) => item.quantity > 0); // Automatically remove items with quantity 0

      return { items: updatedItems };

    case "UPDATE_ITEM_ATTRIBUTES":
      // Find the specific item to update
      const { id, attributeName, value } = action.payload;

      // Check if changing attributes would make this a duplicate of another item
      const updatedAttribute =
        attributeName === "Size" ? "selectedSize" : "selectedColor";
      const otherAttribute =
        attributeName === "Size" ? "selectedColor" : "selectedSize";

      // Find the item we want to modify
      const itemToUpdate = state.items.find((item) => item.id === id);

      if (!itemToUpdate) return state;

      // Check if we already have an item with the new attribute value
      const duplicateItem = state.items.find(
        (item) =>
          item.id === id &&
          item[updatedAttribute as keyof CartItem] === value &&
          item[otherAttribute as keyof CartItem] ===
            itemToUpdate[otherAttribute as keyof CartItem],
      );

      if (duplicateItem) {
        // If a duplicate exists, increase its quantity and remove the original
        return {
          items: state.items
            .map((item) => {
              if (item === duplicateItem) {
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
        // Otherwise just update the attribute
        return {
          items: state.items.map((item) => {
            if (item.id === id) {
              if (attributeName === "Size") {
                return { ...item, selectedSize: value };
              } else if (attributeName === "Color") {
                return { ...item, selectedColor: value };
              }
            }
            return item;
          }),
        };
      }

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        let parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          // First, clean up or convert the item.price to be a valid number
          parsedCart.forEach((item) => {
            if (typeof item.price === "string") {
              // Strip out non-digit characters, then parse as float
              item.price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
            }
            // If it's still invalid or missing, set to 0
            if (!item.price || isNaN(item.price)) {
              item.price = 0;
            }
          });
          // Optionally remove items that are still invalid
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
