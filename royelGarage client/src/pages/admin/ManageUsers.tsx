import { Table, TableColumnsType, Select, Button, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { useGetAllUsersQuery, useUpdateUserBlockedStatusMutation } from "../../redux/features/admin/user.Api";

// Define the DataType for the users
interface DataType {
  _id: string;
  email: string;
  role: string;
  isBlocked: boolean;
}

// ManageUsers component
const ManageUsers = () => {
  const { data: usersData, isFetching } = useGetAllUsersQuery(undefined);
  const [updateBlockedStatus] = useUpdateUserBlockedStatusMutation();
  const [tableData, setTableData] = useState<DataType[]>([]);

  // Mapping the table data from the fetched users
  useEffect(() => {
    if (usersData?.data) {
      const mappedData: DataType[] = usersData.data.map((user: any) => ({
        _id: user._id,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
      }));
      setTableData(mappedData);
    }
  }, [usersData]);

  // Define columns for the AntD table
  const columns: TableColumnsType<DataType> = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Blocked Status",
      dataIndex: "isBlocked",
      key: "isBlocked",
      render: (isBlocked, record) => (
        <Select
          value={isBlocked ? "Blocked" : "Active"}
          onChange={(value) => handleBlockedStatusChange(value, record._id)}
          style={{ width: 120 }}
        >
          <Select.Option value="Blocked">Blocked</Select.Option>
          <Select.Option value="Active">Active</Select.Option>
        </Select>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title={`Are you sure you want to ${record.isBlocked ? 'unblock' : 'block'} this user?`}
          onConfirm={() => handleBlockedStatusChange(record.isBlocked ? 'Active' : 'Blocked', record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger={record.isBlocked}>
            {record.isBlocked ? "Unblock" : "Block"}
          </Button>
        </Popconfirm>
      ),
    },
  ];

  // Handle status change
  const handleBlockedStatusChange = async (newStatus: string, userId: string) => {
    try {
      const isBlocked = newStatus === "Blocked";
      await updateBlockedStatus({ email: userId, isBlocked });
      console.log("User status updated successfully");

      // Update the table data locally to reflect the status change
      setTableData((prevData) =>
        prevData.map((user) =>
          user._id === userId ? { ...user, isBlocked } : user
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  return (
    <Table<DataType>
      loading={isFetching}
      columns={columns}
      dataSource={tableData}
      rowKey="_id"
    />
  );
};

export default ManageUsers;
