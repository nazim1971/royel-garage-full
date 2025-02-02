import { Button, Card, Col, Row, Image, Input, Select, Slider, Spin, Tag } from "antd";
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

        return (
          matchesSearchQuery &&
          matchesCategory &&
          matchesPrice &&
          matchesStock
        );
      });
      setFilteredProducts(filtered);
    }
  }, [searchQuery, categoryFilter, products, minPrice, maxPrice, instockFilter]);

  if (isFetching) {
    return <Spin tip="Loading products..." />;
  }

  if (isError) {
    return <p>Error loading products. Please try again later.</p>;
  }

  return (
    <div>
      {/* Filters Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col xs={24} sm={12} md={6}>
          <Input
            style={{ width: "100%" }}
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Slider
            range
            min={0}
            max={1000}
            style={{ width: "100%" }}
            defaultValue={[minPrice, maxPrice]}
            onChange={(value) => {
              setMinPrice(value[0]);
              setMaxPrice(value[1]);
            }}
            tooltip={{ formatter: (value) => `$${value}` }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Select
            placeholder="Select a category"
            options={categoryOptions}
            onChange={(value) => setCategoryFilter(value)}
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Select
            placeholder="Check Stock"
            options={inStockOption}
            onChange={(value) => {
              if (value === "") {
                setInstockFilter(undefined);
              } else {
                setInstockFilter(value);
              }
            }}
            style={{ width: "100%" }}
          />
        </Col>
      </Row>

      {/* Product Cards Section */}
      <Row gutter={[16, 16]} justify="start">
        {filteredProducts.length ? (
          filteredProducts.map((i) => (
            <Col
              xs={24}
              sm={12}
              md={8}
              xl={6}
              xxl={4}
              key={i._id}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Card
                title={i?.name}
                bordered={false}
                hoverable
                style={{
                 width: '350px',
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                  textAlign: "center",
                  borderRadius: "10px",
                  transition: "transform 0.3s"
        
                }}
              >
                <Image
                  width={'100%'}
                  height={'250px'}
                  style={{
                    borderRadius: '8px'
                  }}
                  preview={false}
                  src={i?.image || "https://res.cloudinary.com/dfvgxf4dc/image/upload/v1738506391/skeleton-rigind-motorbike_1415-115_sfkmgs.avif"}
                  alt={i?.name}
                />

                {/* Category tag */}
                <Tag
                  style={{
                    backgroundColor: "#E0F7FA",
                    borderRadius: "5px",
                    padding: "4px 8px",
                    fontSize: "14px",
                    marginTop: "10px",
                    width: '80px',
                    textAlign: 'center'
                  }}
                >
                  {i?.category}
                </Tag>

                {/* Horizontal line */}
                <hr style={{ border: "0.5px solid #e8e8e8", margin: "10px 0" }} />

                <p style={{ color: 'GrayText', fontSize: '18px', paddingBottom: '20px' }}>
                  Brand: {i?.brand}
                </p>

                {/* Stock Status with conditional color */}
                <Tag
                  style={{
                    backgroundColor: i?.inStock ? "#D0F9D7" : "#FAD4D4",
                    color: i?.inStock ? "#389e0d" : "#cf1322",
                    borderRadius: "5px",
                    padding: "4px 8px",
                    fontSize: "14px",
                  }}
                >
                  {i?.inStock ? "In Stock" : "Out of Stock"}
                </Tag>

                <p style={{ fontSize: '22px', fontWeight: 'bold', padding: '10px 0px' }}>
                  {i?.price} USD
                </p>
                <Button
                  type="primary"
                  onClick={() => navigate(`/product-details/${i?._id}`)}
                >
                  View details
                </Button>
              </Card>
            </Col>
          ))
        ) : (
          <Col span={24} style={{ textAlign: "center" }}>
            <h2>No Products Found</h2>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default AllProducts;
