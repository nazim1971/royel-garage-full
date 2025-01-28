import { Button, Card, Col, Flex, Input, Select, Slider, Spin } from "antd";
import { useGetAllProductQuery } from "../../redux/features/admin/productApi";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  categoryOptions,
  inStockOption,
  TProduct,
} from "../../types/products.types";

const AllProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(
    undefined
  );
  const [instockFilter, setInstockFilter] = useState<boolean | undefined>(
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
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.model.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = categoryFilter
          ? product.category.toLowerCase() === categoryFilter.toLowerCase()
          : true;

          const matchesStock =
          instockFilter !== undefined
            ? product.inStock === instockFilter
            : true;

        const matchesPrice =
          product.price >= minPrice && product.price <= maxPrice;

        return matchesSearchQuery && matchesCategory && matchesPrice && matchesStock;
      });
      setFilteredProducts(filtered);
    }
  }, [searchQuery, categoryFilter, products, minPrice, maxPrice, instockFilter]);

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
          <Slider
            range
            min={0}
            max={1000}
            defaultValue={[minPrice, maxPrice]}
            onChange={(value) => {
              setMinPrice(value[0]);
              setMaxPrice(value[1]);
            }}
            tooltip={{ formatter: (value) => `$${value}` }}
          />
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
          <Select
            placeholder="Check Stock"
            options={inStockOption}
            onChange={(value) => {
              if (value === '') {
                setInstockFilter(undefined); // Reset filter
              } else {
                setInstockFilter(value); // Apply the selected stock filter
              }
            }}
            style={{ width: "200px" }}
          />
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
        {filteredProducts.length ? (
          filteredProducts?.map((i) => (
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
                <strong>Model:</strong> {i?.model}
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
          ))
        ) : (
          <div>
            <h2> No Data</h2>
          </div>
        )}
      </Col>
    </div>
  );
};

export default AllProducts;
