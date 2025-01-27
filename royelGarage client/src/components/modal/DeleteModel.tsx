import { Button, Space } from "antd";

const showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure delete this task?',
      icon: <ExclamationCircleFilled />,
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const DeleteModal: React.FC = () => (
    <Space wrap>
      <Button onClick={showConfirm}>Confirm</Button>
      <Button onClick={showPromiseConfirm}>With promise</Button>
      <Button onClick={showDeleteConfirm} type="dashed">
        Delete
      </Button>
      <Button onClick={showPropsConfirm} type="dashed">
        With extra props
      </Button>
    </Space>
  );
  
  export default DeleteModal;