import { useCart } from "./CartContext";

const CartOverlay = () => {
  const { state, dispatch } = useCart();

  const totalPrice = state.items.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 flex justify-end z-10">
      {/* Semi-transparent background */}
      <div
        className="absolute bg-amber-500 inset-0 "
        onClick={() => console.log("Background clicked")}
      ></div>

      {/* Cart content */}
      <div className="relative w-96 bg-white h-full p-4 shadow-lg z-20">
        <h2 className="text-lg font-semibold mb-4">
          My Bag, {state.items.length}{" "}
          {state.items.length === 1 ? "Item" : "Items"}
        </h2>
        <div className="flex flex-col gap-4">
          {state.items.map((item) => (
            <div
              key={`${item.id}-${item.selectedSize || "default"}-${
                item.selectedColor || "default"
              }`}
              className="flex gap-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover"
              />
              <div className="flex-1">
                <h3 className="text-sm font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  {item.selectedSize && `Size: ${item.selectedSize}`}
                  {item.selectedColor && `Color: ${item.selectedColor}`}
                </p>
                <p className="text-sm font-medium">
                  {item.currency} {(item.price || 0).toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <button
                  onClick={() =>
                    dispatch({
                      type: "UPDATE_ITEM",
                      payload: {
                        id: item.id,
                        quantity: item.quantity + 1,
                      },
                    })
                  }
                >
                  +
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    dispatch({
                      type: "UPDATE_ITEM",
                      payload: {
                        id: item.id,
                        quantity: item.quantity - 1,
                      },
                    })
                  }
                >
                  -
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium">
            Total: {state.items[0]?.currency || "$"} {totalPrice.toFixed(2)}
          </p>
          <button
            className={`w-full py-2 mt-4 ${
              state.items.length > 0
                ? "bg-green-500 text-white"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
            disabled={state.items.length === 0}
            onClick={() => console.log("Place Order")}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartOverlay;