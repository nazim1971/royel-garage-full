import { useNavigate, useParams } from "react-router";
import {  useGetProductByIdQuery } from "../../redux/features/admin/productApi";
import { Button, Spin } from "antd";

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL params
  const { data: product, isFetching, isError } = useGetProductByIdQuery(id );

  const navigate = useNavigate()

  console.log(product);

  if (isFetching) {
    return <Spin tip="Loading product details..." />;
  }

  if (isError || !product) {
    return <p>Error loading product details. Please try again later.</p>;
  }

  return (
    <div>
    <h2>{product.data?.name}</h2>
    <p>
      <strong>Brand:</strong> {product.data?.brand}
    </p>
    <p>
      <strong>Category:</strong> {product.data?.category}
    </p>
    <p>
      <strong>Description:</strong> {product.data?.description}
    </p>
    <p>
      <strong>Price:</strong> ${product.data?.price}
    </p>
    <p>
      <strong>Quantity:</strong> {product.data?.quantity}
    </p>
    <p>
      <strong>In Stock:</strong> {product.data?.isStock ? "Yes" : "No"}
    </p>

    <Button style={{backgroundColor: 'green'}} onClick={() => navigate(`/check-out`)} > Buy Now </Button>
  </div>
  )
}

export default ProductDetails