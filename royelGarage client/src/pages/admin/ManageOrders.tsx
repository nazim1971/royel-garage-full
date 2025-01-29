import { Table, TableColumnsType, TableProps, Select } from "antd";
import { useGetAllOrderQuery } from "../../redux/features/admin/orderApi";
import { useUpdateOrderMutation } from "../../redux/features/admin/orderApi"; // Import the mutation

import { TQueryParam } from "../../types/globel";
import { TProduct } from "../../types/products.types";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";

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
  const [updateOrder] = useUpdateOrderMutation(); // Initialize updateOrder mutation
  const user = useAppSelector(selectCurrentUser);

  // Mapping the table data from the fetched orders
  const tableData: DataType[] =
    orderData?.data?.map((order: any) => ({
      _id: order._id,
      email: order.email,
      product: order.product,
      quantity: order.quantity,
      totalPrice: order.totalPrice,
      status: order.status,
      isCancel: order.isCancel,
      createdAt: order.createdAt,
    })) || [];

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
        defaultValue={status}
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
      render: (isCancel) => (isCancel ? "Yes" : "No"),
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value, record) => record.isCancel === value,
    },
  ];

  // Handling the status change (call the update mutation)
  const handleStatusChange = async (newStatus: string, orderId: string, isCancel?: boolean) => {
    try {
      await updateOrder({ id: orderId, status: newStatus, isCancel, role: `${user?.role}` }); // Assuming "admin" for role
      console.log("Order status updated successfully");
    } catch (error) {
      console.error("Error updating order status:", error);
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
