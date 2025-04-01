import ProductsCard from "./ProductsProp"
import { useEffect, useState } from "react"
import axios from "axios"
interface Product {
  id: number;
  name: string;
  price: number;
  images: string;
  category_name: string;
}
interface ProductsSectionProps {
  activeCategory: string;
}
const ProductsSection = ({activeCategory}: ProductsSectionProps) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
    .get<Product[]>(import.meta.env.VITE_APP_API_URL || 'http://localhost:8000/api/products')
    .then((response: { data: Product[] }) => {
      console.log("Products fetched successfully:", response.data)
      setProducts(response.data)
      setLoading(false)
    })
    .catch((error: unknown) => {
      console.error("Error fetching products:", error)
      setLoading(false)
    })
  }, [])
  if (loading) {
    return <p>Loading products...</p>;
  }
  const filteredProducts =
  activeCategory.toLowerCase() === "all"
    ? products
    : products.filter(
        (product) =>
          product.category_name.toLowerCase() === activeCategory.toLowerCase()
      );
  return (
    <section className="mr-22 ml-22">
      <h2 className="text-2xl">{activeCategory}</h2>
      <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductsCard
          key={product.id}
          name={product.name}
          price={Number(product.price).toFixed(2)} // Convert price to a number
          imageUrl={product.images}
          />
        ))}
      </div>
    </section>
  )
}

export default ProductsSection
