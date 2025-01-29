import { useParams } from "react-router";
import { useGetProductByIdQuery } from "../../redux/features/admin/productApi";
import { Button, Spin } from "antd";
import OrderModel from "../../components/modal/OrderModel";
import { useState } from "react";

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL params
  const { data: product, isFetching, isError, refetch } = useGetProductByIdQuery(id);
    const [openModal, setOpenModal] = useState(false);



  console.log(product);

  if (isFetching) {
    return <Spin tip="Loading product details..." />;
  }

  if (isError || !product) {
    return <p>Error loading product details. Please try again later.</p>;
  }

  const handleOrderNow = () => {
    setOpenModal(true); // Open modal in add mode
  };

  return (
    <>
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
        <strong>In Stock:</strong> {product.data?.inStock ? "Yes" : "No"}
      </p>

      <Button
        style={{ backgroundColor: "green" }}
        disabled={!product.data?.inStock}
        onClick={handleOrderNow}
      >
        Buy Now
      </Button>
    </div>
    <OrderModel
        refetch={refetch}
        product={product}
        open={openModal}
        onClose={() => {
          setOpenModal(false);  
        }}
      />
    </>
  );
};

export default ProductDetails;
