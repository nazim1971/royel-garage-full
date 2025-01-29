import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, message, Modal, Spin } from 'antd';
import { TResponse } from '../../types/globel';
import { z } from 'zod';
import { useAddOrderMutation } from '../../redux/features/customer/OrderApi';
import { TOrder } from '../../types/order.types';
import { OrderSchema } from '../../schema/order.schema';
import { TProduct } from '../../types/products.types';


// Props type definition for OrderModel component
interface OrderModelProps {
  refetch: () => void;
  open: boolean;
  onClose: () => void;
  product: TProduct
}

// Refactored OrderModel component
const OrderModel: React.FC<OrderModelProps> = ({ refetch, open, onClose, product }) => {
  const [addOrder] = useAddOrderMutation();
  const [form] = Form.useForm<TOrder>();
  const [formErrors, setFormErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
      form.resetFields(); // Reset fields if adding a new order
  }, [form]);

  const onFinish = async (values: TOrder) => {
    try {
      setLoading(true); // Start loading spinner
      setFormErrors({});
      OrderSchema.parse(values); // Validate with Zod schema

      const orderData = {
        userId: values.userId,
        email: values.email,
        product: product._id,
        quantity: values.quantity,
        totalPrice: totalPrice,
      };

      let res: TResponse;
        res = await addOrder(orderData);

      if (res?.error) {
        message.error(res.error?.data?.message || 'Failed to submit order.');
      } else {
        message.success(res.data?.message || 'Order added successfully!');
        form.resetFields(); // Reset the form after successful submission
        refetch();
        onClose(); // Close the modal after submission
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const fieldName = err.path[0] as string;
          fieldErrors[fieldName] = err.message;
        });
        setFormErrors(fieldErrors);
      }
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <Modal
      title={'Add Order'}
      open={open}
      onCancel={onClose}
      footer={null} // Remove the default footer
    >
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, paddingTop: '40px' }}
        onFinish={onFinish}
        autoComplete="off"
      >

        <Form.Item
          label="Quantity"
          name="quantity"
          validateStatus={formErrors.quantity ? 'error' : ''}
          help={formErrors.quantity}
        >
          <InputNumber style={{ width: '100%' }} placeholder="Enter quantity" />
        </Form.Item>

        <Form.Item
          label="Total Price"
          name="totalPrice"
          validateStatus={formErrors.totalPrice ? 'error' : ''}
          help={formErrors.totalPrice}
        >
          <InputNumber style={{ width: '100%' }} placeholder="Enter total price" />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" disabled={loading}>
            {loading ? <Spin /> : 'Submit'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OrderModel;
