import { Button, Card, Col, Flex, Input, Select, Slider, Spin } from "antd";
import { useGetAllProductQuery } from "../../redux/features/admin/productApi";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { categoryOptions, TProduct } from "../../types/products.types";

const AllProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(
    undefined
  );
  const [filteredProducts, setFilteredProducts] = useState<TProduct[]>([]);

  const {
    data: products,
    isFetching,
    isError,
  } = useGetAllProductQuery(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    if (products?.data) {
      const filtered = products.data.filter((product) => {
        const matchesSearchQuery =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = categoryFilter
          ? product.category.toLowerCase() === categoryFilter.toLowerCase()
          : true;

        return matchesSearchQuery && matchesCategory;
      });
      setFilteredProducts(filtered);
    }
  }, [searchQuery, categoryFilter, products]);

  if (isFetching) {
    return <Spin tip="Loading products..." />;
  }

  if (isFetching) {
    return <Spin tip="Loading products..." />;
  }

  if (isError) {
    return <p>Error loading products. Please try again later.</p>;
  }

  return (
    <div>
      <Flex gap={10}>
        <Col span={6}>
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col span={6}>
          <Slider min={1} max={1000} />
        </Col>
        <Col span={6}>
          <Select
            placeholder="Select a category"
            options={categoryOptions}
            onChange={(value) => setCategoryFilter(value)}
            style={{ width: "200px" }}
          />
        </Col>
        <Col span={6}>
          <Select style={{ width: "200px" }} />
        </Col>
      </Flex>

      {/* Product cards */}
      <Col
        span={24}
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        {filteredProducts?.map((i) => (
          <Card
            title={i?.name}
            key={i._id}
            bordered={false}
            style={{
              width: 250,
              margin: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            }}
          >
            <p>
              <strong>Brand:</strong> {i?.brand}
            </p>
            <p>
              <strong>Category:</strong> {i?.category}
            </p>
            <p>
              <strong>Description:</strong> {i?.description}
            </p>
            <p>
              <strong>Price:</strong> ${i?.price}
            </p>
            <p>
              <strong>Quantity:</strong> {i?.quantity}
            </p>
            <p>
              <strong>In Stock:</strong> {i?.inStock ? "Yes" : "No"}
            </p>
            <Button onClick={() => navigate(`/product-details/${i?._id}`)}>
              View details
            </Button>
          </Card>
        ))}
      </Col>
    </div>
  );
};

export default AllProducts;
