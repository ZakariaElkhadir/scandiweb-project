import { ShoppingCart } from "lucide-react";
/**
 * Each Product Card have to display following: the product's main image, product name, product price
 * Product Price have to be in the correct format (2 digits after the dot)
 */
interface ProductProps {
  imageUrl: string;
  name: string;
  price: string;
  onAddToCart?: () => void;
  inStock?: string | number;
}

const ProductsCard = ({ name, price, imageUrl, inStock }: ProductProps) => {
  const onAddToCart = () => {
    console.log("Add to cart clicked");
  };
  return (
    <div className="w-64 h-72 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col p-2 cursor-pointer group">
      <div className="relative overflow-hidden h-48 w-full mb-3">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
        />
        {inStock == 0 && (
          <span
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
             bg-red-600  text-white px-2 py-1 rounded"
          >
            Out of Stock
          </span>
        )}
      </div>
      <div className="relative -mt-8 mb-3 flex justify-end">
        <button
          onClick={onAddToCart}
          className="w-10 h-10 rounded-full bg-[#5ECE7B] flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <ShoppingCart width={20} color="white" />
        </button>
      </div>
      <h4 className="text-lg font-medium text-gray-800 mb-1 truncate">
        {name}
      </h4>
      <p className="text-xl font-bold text-gray-900">{price}</p>
    </div>
  );
};

export default ProductsCard;
