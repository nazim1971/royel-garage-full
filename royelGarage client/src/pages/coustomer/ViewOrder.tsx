import { Table, TableColumnsType, TableProps, Button } from "antd";
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
        <Button
          type="primary"
          danger
          disabled={isCancel} // Disable button if the order is already canceled
          onClick={() => handleCancelOrder(record._id)}
        >
          {isCancel ? "Canceled" : "Cancel Order"}
        </Button>
      ),
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value, record) => record.isCancel === value,
    },
  ];

  return (
    <Table<DataType>
      loading={isFetching}
      columns={columns}
      dataSource={localData} // Use localData for immediate updates
      rowKey="_id"
    />
  );
};

export default ViewOrder;
