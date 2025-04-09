import { useParams } from "react-router-dom";
import { gql, useQuery } from '@apollo/client';
import ProductDetails from './productDetails';

const GET_PRODUCT_DETAILS = gql`
  query GetProductDetails($id: String!) {
    product(id: $id) {
      id
      name
      description
      brand
      price
      currency {
        label
        symbol
      }
      images
      attributes {
        name
        type
        items {
          display_value
          value
        }
      }
      in_stock
    }
  }
`;

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery(GET_PRODUCT_DETAILS, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <ProductDetails product={data.product} />;
};
export default ProductPage;