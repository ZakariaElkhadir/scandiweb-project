import React, { createContext, useContext, useReducer, useEffect } from "react";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  currency: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartState {
  items: CartItem[];
}

interface CartAction {
  type: "ADD_ITEM" | "UPDATE_ITEM";
  payload: any;
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM":
  const existingItemIndex = state.items.findIndex(
    (item) =>
      item.id === action.payload.id &&
      item.selectedSize === action.payload.selectedSize &&
      item.selectedColor === action.payload.selectedColor
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
            : item
        )
        .filter((item) => item.quantity > 0); // Automatically remove items with quantity 0
      return { items: updatedItems };

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Sync with localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          parsedCart.forEach((item) => {
            if (!item.price) item.price = 0;
          });
          dispatch({ type: "ADD_ITEM", payload: parsedCart });
        }
      } catch (error) {
        console.error("Failed to parse cart data:", error);
      }
    }
  }, []);

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
