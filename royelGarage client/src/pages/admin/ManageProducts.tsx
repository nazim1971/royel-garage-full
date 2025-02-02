import { Button, Card, Col, Row, Flex, message, Spin, Image } from "antd";
import { useState } from "react";
import { useDeleteProductMutation, useGetAllProductQuery } from "../../redux/features/admin/productApi";
import ProductModel from "../../components/modal/Product.model";
import DeleteModal from "../../components/modal/DeleteModel";
import { TProduct } from "../../types/products.types";

const ManageProducts = () => {
  const { data: products, refetch, isFetching, isError } = useGetAllProductQuery(undefined);
  const [deleteProduct] = useDeleteProductMutation();
  const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  if (isFetching) {
    return (
      <Spin
        tip="Loading products..."
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      />
    );
  }

  if (isError) {
    return (
      <p
        style={{
          textAlign: 'center',
          color: 'red',
          fontWeight: 'bold',
          marginTop: '20px',
        }}
      >
        Error loading products. Please try again later.
      </p>
    );
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
      <Flex
        justifyContent="end"
        style={{
          justifyContent: 'flex-end',
          paddingBottom: '20px',
          paddingRight: '20px', // Padding for the button to align with content
        }}
      >
        <Button
          type="primary"
          onClick={handleAddNew}
          style={{
            backgroundColor: '#1890ff',
            borderColor: '#1890ff',
            transition: 'all 0.3s',
          }}
        >
          Add New Bike
        </Button>
      </Flex>

      <Row
        gutter={[24, 24]}
        style={{
          margin: '0 auto',
          padding: '20px', // Overall padding for the container
        }}
      >
        {products?.data?.map((product) => (
          <Col
            xs={24}
            sm={12}
            md={8}
            lg={6}
            xxl={4}
            key={product._id}
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '10px', // Spacing between cards
            }}
          >
            <Card
             
              style={{
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                width: '350px', // Make sure the card takes full width of the container
      
              }}
            >

               <Image
                  alt={product.name}
                  src={product.image || "https://res.cloudinary.com/dfvgxf4dc/image/upload/v1738506391/skeleton-rigind-motorbike_1415-115_sfkmgs.avif"} // Default image if no product image
                  style={{
                    width: '100%',
                    height: '250px',
                    borderBottom: '1px solid #f0f0f0',
                    borderRadius: '8px 8px 0 0',
                  }}
                />
            <div>
               <div>
             <p style={{ padding: '5px 0' }}><strong>Brand:</strong> {product.brand}</p>
                    <p style={{ padding: '5px 0' }}><strong>Price:</strong> ${product.price}</p>
                    <p style={{ padding: '5px 0' }}><strong>Stock:</strong> {product.inStock ? "In Stock" : "Out of Stock"}</p>
             </div>
               <div style={{display: 'flex', justifyContent: 'space-between'}} > 
               <Button
                  type="primary"
                  onClick={() => handleEdit(product)}
                >
                  Update
                </Button>
                <DeleteModal onDelete={() => handleDelete(product?._id)} />
               </div>
            </div>
                
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
