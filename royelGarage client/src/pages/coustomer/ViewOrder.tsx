import { Table, TableColumnsType, Button, Popconfirm, Tag } from "antd";
import { useGetAllOrderByEmailQuery } from "../../redux/features/admin/orderApi"; // Use email-based query
import { useUpdateOrderMutation } from "../../redux/features/admin/orderApi"; // Import the mutation for canceling order
import { TProduct } from "../../types/products.types";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import { useState, useEffect } from "react";

// Define the DataType for the order
interface DataType {
  _id: string;
  email: string;
  product: TProduct;
  quantity: number;
  totalPrice: number;
  status: string;
  isCancel: boolean;
  createdAt: string;
}

// ViewOrder component
const ViewOrder = () => {
  const user = useAppSelector(selectCurrentUser); // Get the current user
  const { data: orderData, isFetching, refetch } = useGetAllOrderByEmailQuery(user?.email || "");
  const [updateOrder] = useUpdateOrderMutation(); // Mutation for canceling an order
  const [localData, setLocalData] = useState<DataType[]>([]); // Local state for UI updates

  // Sync localData with fetched orderData when it changes
  useEffect(() => {
    if (orderData?.data) {
      const mappedData = orderData.data.map((order: any) => ({
        _id: order._id,
        email: order.email,
        product: order.product,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        status: order.status,
        isCancel: order.isCancel,
        createdAt: order.createdAt,
      }));
      setLocalData(mappedData);
    }
  }, [orderData]);

  // Handle order cancellation
  const handleCancelOrder = async (orderId: string) => {
    try {
      // Optimistically update the local state
      setLocalData((prevData) =>
        prevData.map((order) =>
          order._id === orderId ? { ...order, isCancel: true } : order
        )
      );

      // Perform the mutation
      await updateOrder({ id: orderId, isCancel: true, role: `${user?.role}` });
      console.log("Order canceled successfully");

      // Refetch the data to ensure UI consistency
      refetch();
    } catch (error) {
      console.error("Error canceling the order:", error);
    }
  };

  // Define columns for AntD table
  const columns: TableColumnsType<DataType> = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Product",
      render: (text, record) => record.product?.name || "No Product Name",
      key: "product",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "";
        switch (status) {
          case "Pending":
            color = "orange";
            break;
          case "Processing":
            color = "blue";
            break;
          case "Shipped":
            color = "purple";
            break;
          case "Delivered":
            color = "green";
            break;
          default:
            color = "default";
        }
        return <Tag color={color}>{status}</Tag>;
      },
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Processing", value: "Processing" },
        { text: "Shipped", value: "Shipped" },
        { text: "Delivered", value: "Delivered" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Cancel Order",
      dataIndex: "isCancel",
      key: "isCancel",
      render: (isCancel, record) => (
        <Popconfirm
          title="Are you sure you want to cancel this order?" // Confirm message
          onConfirm={() => handleCancelOrder(record._id)} // Confirm action
          okText="Yes"
          cancelText="No"
          placement="leftTop"
          disabled={isCancel} // Disable Popconfirm if the order is already canceled
        >
          <Button
            type="primary"
            danger
            disabled={isCancel} // Disable button if the order is already canceled
          >
            {isCancel ? "Canceled" : "Cancel Order"}
          </Button>
        </Popconfirm>
      ),
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value, record) => record.isCancel === value,
    }
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
    <Table<DataType>
      loading={isFetching}
      columns={columns}
      dataSource={localData} // Use localData for immediate updates
      rowKey="_id"
      scroll={{ x: 1000 }} // Add horizontal scroll for responsiveness
    />
  </div>
  );
};

export default ViewOrder;
