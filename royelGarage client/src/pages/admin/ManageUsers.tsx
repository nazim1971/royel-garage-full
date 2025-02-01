import { Table, TableColumnsType, Button, Popconfirm, Tag, Select } from "antd";
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
  const [filteredStatus, setFilteredStatus] = useState<string | undefined>(undefined);

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
      render: (isBlocked) => (
        <Tag color={isBlocked ? "red" : "green"}>
          {isBlocked ? "Blocked" : "Active"}
        </Tag>
      ),
      // Add a filter for Blocked and Active status
      filters: [
        { text: "Active", value: "Active" },
        { text: "Blocked", value: "Blocked" },
      ],
      onFilter: (value, record) => (value === "Blocked" ? record.isBlocked : !record.isBlocked),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title={`Are you sure you want to ${record.isBlocked ? 'unblock' : 'block'} this user?`}
          onConfirm={() => handleBlockedStatusChange(record.isBlocked, record.email)}
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

  // Handle status change with boolean toggle and email
  const handleBlockedStatusChange = async (currentStatus: boolean, email: string) => {
    try {
      // Toggle the blocked status (true becomes false, false becomes true)
      const newStatus = !currentStatus;

      // Send the updated status with email
      await updateBlockedStatus({ email, isBlocked: newStatus });

      // Update the table data locally to reflect the status change
      setTableData((prevData) =>
        prevData.map((user) =>
          user.email === email ? { ...user, isBlocked: newStatus } : user
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  return (
    <>
      <div style={{ marginBottom: "20px" }}>
        {/* Filter for Blocked and Active users */}
        <Select
          style={{ width: 200 }}
          placeholder="Filter by status"
          onChange={setFilteredStatus}
          allowClear
        >
          <Select.Option value="Active">Active</Select.Option>
          <Select.Option value="Blocked">Blocked</Select.Option>
        </Select>
      </div>

      <Table<DataType>
        loading={isFetching}
        columns={columns}
        dataSource={
          filteredStatus
            ? tableData.filter(user =>
                filteredStatus === "Blocked" ? user.isBlocked : !user.isBlocked
              )
            : tableData
        }
        rowKey="_id"
      />
    </>
  );
};

export default ManageUsers;
