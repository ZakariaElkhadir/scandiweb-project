import ProductsCard from "./ProductsProp"
import { useEffect, useState } from "react"
import axios from "axios"
interface Product {
  id: number;
  name: string;
  price: number;
  images: string;
}
const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
    .get<Product[]>(process.env.vite_APP_API_URL || 'http://localhost:8000/api/products')
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
  return (
    <section className="mr-22 ml-22">
      <h2 className="text-2xl">collection</h2>
      <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
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
