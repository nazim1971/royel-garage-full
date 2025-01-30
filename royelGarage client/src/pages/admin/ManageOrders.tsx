import {
  Table,
  TableColumnsType,
  TableProps,
  Select,
  Popconfirm,
  Button,
} from "antd";
import {
  useDeleteOrderMutation,
  useGetAllOrderQuery,
} from "../../redux/features/admin/orderApi";
import { useUpdateOrderMutation } from "../../redux/features/admin/orderApi"; // Import the mutation

import { TQueryParam } from "../../types/globel";
import { TProduct } from "../../types/products.types";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import { useEffect, useState } from "react";

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

// ManageOrder component
const ManageOrder = () => {
  // Fetch order data using your query
  const { data: orderData, isFetching } = useGetAllOrderQuery(undefined);
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const [tableData, setTableData] = useState<DataType[]>([]);
  const user = useAppSelector(selectCurrentUser);

  // Mapping the table data from the fetched orders
  useEffect(() => {
    if (orderData?.data) {
      const mappedData: DataType[] = orderData?.data.map((order: any) => ({
        _id: order._id,
        email: order.email,
        product: order.product,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        status: order.status,
        isCancel: order.isCancel,
        createdAt: order.createdAt,
      }));
      setTableData(mappedData); // Set initial table data
    }
  }, [orderData]);

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
      render: (status, record) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(value, record._id)}
          style={{ width: 120 }}
        >
          <Select.Option value="Pending">Pending</Select.Option>
          <Select.Option value="Processing">Processing</Select.Option>
          <Select.Option value="Shipped">Shipped</Select.Option>
          <Select.Option value="Delivered">Delivered</Select.Option>
        </Select>
      ),
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Processing", value: "Processing" },
        { text: "Shipped", value: "Shipped" },
        { text: "Delivered", value: "Delivered" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Cancelled",
      dataIndex: "isCancel",
      key: "isCancel",
      render: (isCancel) => (
        <span
          style={{
            display: "inline-block",
            padding: "5px 15px",
            borderRadius: "20px",
            backgroundColor: isCancel ? "red" : "green", // Red for canceled, green for not canceled
            color: "white",
            textAlign: "center",
          }}
        >
          {isCancel ? "Yes" : "No"}
        </span>
      ),
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value, record) => record.isCancel === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this order?"
          onConfirm={() => handleDeleteOrder(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="dashed" style={{ backgroundColor: "red", color: 'white' }}>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  // Handling the status change (call the update mutation)
  const handleStatusChange = async (newStatus: string, orderId: string) => {
    try {
      await updateOrder({
        id: orderId,
        status: newStatus,
        role: `${user?.role}`,
      });
      console.log("Order status updated successfully");

      // Update the table data locally to reflect the status change
      setTableData((prevData) =>
        prevData.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      console.log("Order deleted successfully");

      // Remove the deleted order from the local state
      setTableData((prevData) =>
        prevData.filter((order) => order._id !== orderId)
      );
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // Handling table changes (pagination, filtering, sorting)
  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    if (extra.action === "filter") {
      const queryParams: TQueryParam[] = [];
      filters.status?.forEach((item) =>
        queryParams.push({ name: "status", value: item })
      );
      // setParams(queryParams);
    }
  };

  return (
    <Table<DataType>
      loading={isFetching}
      columns={columns}
      dataSource={tableData}
      onChange={onChange}
      rowKey="_id"
    />
  );
};

export default ManageOrder;
