import { useNavigate, useParams } from "react-router";
import { useGetProductByIdQuery } from "../../redux/features/admin/productApi";
import { Button, Spin, Card, Row, Col, Typography, message } from "antd";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import { useAppSelector } from "../../redux/hooks";

const { Title, Text } = Typography;

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from the URL params
  const { data: product, isFetching, isError } = useGetProductByIdQuery(id);
  const user = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();

  // Handle loading state
  if (isFetching) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin tip="Loading product details..." size="large" />
      </div>
    );
  }

  // Handle error or missing product
  if (isError || !product) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p style={{ color: "red", fontSize: "18px" }}>
          {isError ? "Error loading product details. Please try again later." : "Product not found."}
        </p>
      </div>
    );
  }

  const productData = product.data;

  // Conditional navigation logic
  const handleBuyNow = () => {
    if (user) {
      navigate(`/${user.role}/check-out/${productData._id}`);
    } else {
      message.warning("Please log in to proceed to checkout.");
      navigate("/login");
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "auto" }}>
      <Card bordered={false}>
        <Row gutter={[24, 24]} >
          <Col xs={24} md={12}  lg={12}>
            <img
              src={productData?.image || "https://via.placeholder.com/400"}
              alt={productData?.name}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          </Col>
          <Col xs={24} md={12} lg={12}>
            <div style={{ paddingLeft: "10px" }}>
              <Title level={3} style={{ marginBottom: "10px" }}>
                {productData?.name}
              </Title>
              <Text style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                Brand: {productData?.brand}
              </Text>
              <p style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "12px" }}>
                {productData?.price} USD
              </p>
              <p
                style={{
                  color: productData?.inStock ? "green" : "red",
                  marginBottom: "20px",
                  fontWeight: "bold",
                }}
              >
                {productData?.inStock ? "In Stock -" : "Out of Stock -"} {productData?.quantity} available
              </p>
              <Button
  type="primary"
  size="large"
  style={{
    backgroundColor: productData?.inStock && user?.role !== "admin" ? "black" : "#d9d9d9",
    borderColor: productData?.inStock && user?.role !== "admin" ? "black" : "#d9d9d9",
    cursor: productData?.inStock && user?.role !== "admin" ? "pointer" : "not-allowed",
  }}
  disabled={!productData?.inStock || user?.role === "admin"}
  onClick={handleBuyNow}
>
{ !productData?.inStock ? "Out of Stock" : 
    user?.role === "admin" ? "Not Permitted" : 
    "Buy Now" }
</Button>

              <div style={{ marginTop: "20px" }}>
                <h3>Product Details</h3>
                <p>{productData?.description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px",marginTop: '10px' }}>
                  <div>
                    <Text><strong>Category:</strong> {productData?.category}</Text>
                  </div>
                  <div>
                    <Text><strong>Brand:</strong> {productData?.brand}</Text>
                  </div>
                  <div>
                    <Text><strong>Quantity:</strong> {productData?.quantity}</Text>
                  </div>
                  <div>
                    <Text>
                      <strong>Availability:</strong>{" "}
                      <span style={{ color: productData?.inStock ? "green" : "red" }}>
                        {productData?.inStock ? "Available" : "Not Available"}
                      </span>
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ProductDetails;
