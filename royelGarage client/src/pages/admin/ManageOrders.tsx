import { Table, TableColumnsType, TableProps } from "antd";
import { useGetAllOrderQuery } from "../../redux/features/admin/orderApi";

import { TQueryParam } from "../../types/globel";
import { TProduct } from "../../types/products.types";

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
  // State for query params (if required for future filtering)
  // const [params, setParams] = useState<TQueryParam[] | undefined>(undefined);

  // Fetch order data using your query
  const { data: orderData, isFetching } = useGetAllOrderQuery(undefined);
  console.log(orderData);

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
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Completed", value: "Completed" },
        { text: "Cancelled", value: "Cancelled" },
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
