

const ManageProducts = () => {

   const { data: products, refetch, isFetching, isError } = useGetAllProductQuery(undefined);

   if (isFetching) {
    return <Spin tip="Loading products..." />;
  }

  if (isError) {
    return <p>Error loading products. Please try again later.</p>;
  }


  return (
    <Col
        span={24}
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        {products?.data?.map((i) => (
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
            {/* <Button variant="outlined" onClick={()=>handleDelete(i._id)} >Delete</Button> */}
            <Button type="primary" onClick={() => handleEdit(i)}>
              Update
            </Button>
            <DeleteModal onDelete={()=>handleDelete(i._id)} />
          </Card>
        ))}
      </Col>
  )
}

export default ManageProducts