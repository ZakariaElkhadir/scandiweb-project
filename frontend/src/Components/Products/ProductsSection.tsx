import ProductsCard from "./ProductsProp";

import { gql, useQuery } from "@apollo/client";

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  category_name: string;
  in_stock: string;
  currency: {
    label: string;
    symbol: string;
  };
}
interface GetProductsData {
  products: Product[];
}
interface ProductsSectionProps {
  activeCategory: string;
}
const ProductsSection = ({ activeCategory }: ProductsSectionProps) => {
  const GET_PRODUCTS = gql`
    query GetProductsQuery {
      products {
        id
        name
        price
        images
        category_name
        in_stock
        currency {
          label
          symbol
        }
      }
    }
  `;
  const { loading, error, data } = useQuery<GetProductsData>(GET_PRODUCTS);

  // useEffect(() => {
  //   axios
  //     .get<Product[]>(
  //       import.meta.env.VITE_APP_API_URL || "http://localhost:8000/api/products"
  //     )
  //     .then((response: { data: Product[] }) => {
  //       console.log("Products fetched successfully:", response.data);
  //       setProducts(response.data);
  //       setLoading(false);
  //     })
  //     .catch((error: unknown) => {
  //       console.error("Error fetching products:", error);
  //       setLoading(false);
  //     });
  // }, []);
  //--- Loading State ---
  if (loading) {
    return (
      <div role="status" className="flex justify-center items-center h-screen">
        <svg
          aria-hidden="true"
          className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-[#5ECE7B]"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
  // --- Error State ---
  if (error) {
    console.error("Error fetching products:", error);
    return (
      <div className="text-center text-red-500 p-4">
        Error loading products. Please try again later.
        <pre className="text-xs text-left whitespace-pre-wrap">
          {error.message}
        </pre>
      </div>
    );
  }
  const products = data?.products ?? [];
  const filteredProducts =
    activeCategory.toLowerCase() === "all"
      ? products
      : products.filter(
          (product) =>
            product.category_name.toLowerCase() ===
            activeCategory.toLowerCase(),
        );

  return (
    <section className="mr-22 ml-22">
      <h2 className="text-2xl capitalize">{activeCategory}</h2>
      <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
        {filteredProducts.length > 0
          ? filteredProducts.map((product) => (
              <ProductsCard
                key={product.id}
                id={product.id.toString()}
                name={product.name}
                price={`${product.currency.symbol}${Number(product.price).toFixed(2)}`}
                imageUrl={product.images?.[0] ?? "default.jpg"}
                inStock={Number(product.in_stock)}
              />
            ))
          : activeCategory.toLowerCase() !== "all" && (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">
                  No products found in the "{activeCategory}" category.
                </p>
              </div>
            )}
        {products.length === 0 &&
          activeCategory.toLowerCase() === "all" &&
          !loading && (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">
                No products available at the moment.
              </p>
            </div>
          )}
      </div>
    </section>
  );
};

export default ProductsSection;
