import React from "react";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Modal, Space } from "antd";

const { confirm } = Modal;

type DeleteModalProps = {
  onDelete: () => void; // Function type for the delete action
};

const DeleteModal: React.FC<DeleteModalProps> = ({ onDelete }) => {
  const showDeleteConfirm = () => {
    confirm({
      title: "Are you sure you want to delete this product?",
      icon: <ExclamationCircleFilled />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        onDelete(); // Call the delete function passed from the parent
      },
      onCancel() {
        console.log("Cancelled deletion");
      },
    });
  };

  return (
    <Space wrap>
      <Button onClick={showDeleteConfirm} type="dashed">
        Delete
      </Button>
    </Space>
  );
};

export default DeleteModal;
