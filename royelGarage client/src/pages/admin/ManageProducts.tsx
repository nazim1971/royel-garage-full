import { Button, Card, Col, Row, Flex, message, Spin } from "antd";
import { useState } from "react";
import { useDeleteProductMutation, useGetAllProductQuery } from "../../redux/features/admin/productApi";
import ProductModel from "../../components/modal/Product.model";
import DeleteModal from "../../components/modal/DeleteModel";
import { TProduct } from "../../types/products.types";
import '../../styles/ManageProducts.css'; // Add custom CSS for more control over styling

const ManageProducts = () => {
  const { data: products, refetch, isFetching, isError } = useGetAllProductQuery(undefined);
  const [deleteProduct] = useDeleteProductMutation();
  const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  if (isFetching) {
    return <Spin tip="Loading products..." className="loading-spinner" />;
  }

  if (isError) {
    return <p className="error-text">Error loading products. Please try again later.</p>;
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id).unwrap();
      refetch();
      message.success('Product deleted successfully!');
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleEdit = (product: TProduct) => {
    setSelectedProduct(product);
    setIsEditMode(true);
    setOpenModal(true); // Open modal in edit mode
  };

  const handleAddNew = () => {
    setSelectedProduct(null); // Reset selected product for new entry
    setIsEditMode(false); // Set to add mode
    setOpenModal(true); // Open modal in add mode
  };

  return (
    <>
      <Flex justifyContent="end" style={{ paddingBottom: "20px" }}>
        <Button type="primary" onClick={handleAddNew}>
          Add New Bike
        </Button>
      </Flex>

      <Row gutter={[24, 24]} className="product-list-container">
        {products?.data?.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product._id} className="product-card-col">
            <Card
              className="product-card"
              hoverable
              cover={
                <img
                  alt={product.name}
                  src={product.image || "/default-product.png"} // Default image if no product image
                  className="product-card-image"
                />
              }
              actions={[
                <Button type="primary" onClick={() => handleEdit(product)}>
                  Update
                </Button>,
                <DeleteModal onDelete={() => handleDelete(product?._id)} />
              ]}
            >
              <Card.Meta
                title={product.name}
                description={
                  <>
                    <p><strong>Brand:</strong> {product.brand}</p>
                    <p><strong>Price:</strong> ${product.price}</p>
                    <p><strong>Stock:</strong> {product.inStock ? "In Stock" : "Out of Stock"}</p>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Product Modal */}
      <ProductModel
        refetch={refetch}
        isEditMode={isEditMode}
        initialValues={selectedProduct}
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedProduct(null);
        }}
      />
    </>
  );
};

export default ManageProducts;
