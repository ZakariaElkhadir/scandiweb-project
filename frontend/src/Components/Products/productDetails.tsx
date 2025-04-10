import { useState } from 'react';

interface ProductDetailsProps {
  product: {
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
    description: string; // This contains HTML content
  };
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Find size and color attributes
  const sizeAttribute = product.attributes.find(attr => attr.name === 'Size');
  const colorAttribute = product.attributes.find(attr => attr.name === 'Color');

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto p-4">
      {/* Left side - Images */}
      <div className="flex md:w-1/2" data-testid="product-gallery">
        <div className="flex flex-col gap-2 mr-2">
          {product.images.map((image, index) => (
            <div 
              key={index} 
              className={`w-16 h-16 cursor-pointer border ${selectedImage === index ? 'border-black' : 'border-gray-200'}`}
              onClick={() => setSelectedImage(index)}
            >
              <img src={image} alt={`${product.name} thumbnail ${index}`} className="w-full h-full object-cover" />
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
        
        {/* Size selection */}
        {sizeAttribute && (
          <div 
            className="mb-4" 
            data-testid={`product-attribute-${sizeAttribute.name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <p className="text-sm font-medium uppercase mb-2">SIZE:</p>
            <div className="flex gap-2">
              {sizeAttribute.items.map((item) => (
                <button
                  key={item.value}
                  className={`w-10 h-10 flex items-center justify-center border ${
                    selectedSize === item.value 
                      ? 'border-black bg-black text-white' 
                      : 'border-gray-300 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedSize(item.value)}
                >
                  {item.display_value}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Color selection */}
        {colorAttribute && (
          <div 
            className="mb-4" 
            data-testid={`product-attribute-${colorAttribute.name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <p className="text-sm font-medium uppercase mb-2">COLOR:</p>
            <div className="flex gap-2">
              {colorAttribute.items.map((item) => (
                <button
                  key={item.value}
                  className={`w-6 h-6 rounded-sm ${
                    selectedColor === item.value ? 'ring-2 ring-black ring-offset-1' : ''
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
          <p className="text-lg font-medium">{product.currency.symbol}{product.price.toFixed(2)}</p>
        </div>
        
        {/* Add to cart button */}
        <button 
          className="w-full bg-green-500 text-white py-3 px-4 mt-4 hover:bg-green-600 transition"
          data-testid="add-to-cart"
        >
          ADD TO CART
        </button>
        
        {/* Product description */}
        <div 
          className="text-xs prose text-gray-500 mt-6"
          data-testid="product-description"
          dangerouslySetInnerHTML={{ __html: product.description }} // Render HTML content
        />
      </div>
    </div>
  );
};

export default ProductDetails;