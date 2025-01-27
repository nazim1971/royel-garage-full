import React, { useState } from 'react';
import { Button, Form, Input, InputNumber, message, Modal, Select, Spin } from 'antd';
import { useAddProductMutation } from '../../redux/features/admin/productApi';
import { productsOption, TProduct } from '../../types/products.types';
import { TResponse } from '../../types/globel';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  brand: z.string().min(1, { message: 'Brand is required' }),
  price: z.number().min(0, { message: 'Price must be greater than or equal to 0' }),
  category: z.enum(['Mountain', 'Road', 'Hybrid', 'Electric'], { message: 'Invalid category' }),
  description: z.string().min(10, { message: 'Description must be 10 character long' }),
  quantity: z.number().int().min(1, { message: 'Quantity must be at least 1' }),
});

const ProductModel: React.FC = ({refetch}) => {
  const [addProduct] = useAddProductMutation();

  const [form] = Form.useForm<TProduct>();
  const [formErrors, setFormErrors] = useState<any>({});
  const [loading, setLoading] = useState(false); // State to manage submit button loading
  const [open, setOpen] = useState(false);

  const onFinish = async (values: TProduct) => {
    try {
      setLoading(true); // Set loading to true when the form is submitted
      setFormErrors({});

      productSchema.parse(values);

      const productsData = {
        name: values.name,
        brand: values.brand,
        price: values.price,
        category: values.category,
        description: values.description,
        quantity: values.quantity,
        isStock: true,
      };

      const res = (await addProduct(productsData)) as TResponse;
      console.log('RES', res);

      if (res?.error) {
        message.error(res.error?.data?.message || 'Failed to add product.');
      } else {
        message.success(res.data?.message || 'Product added successfully!');
        form.resetFields(); 
        refetch();
        setOpen(false); // Close the modal after successful submission
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: any = {};
        error.errors.forEach((err) => {
          const fieldName = err.path[0];
          fieldErrors[fieldName] = err.message;
        });
        setFormErrors(fieldErrors);
      }
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal with async logic
      </Button>
      <Modal
        title="Add Product"
        open={open}
        onCancel={handleCancel}
        footer={null} // Remove the footer to eliminate the Ok button
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, paddingTop: '40px' }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<TProduct>
            label="Name"
            name="name"
            validateStatus={formErrors.name ? 'error' : ''}
            help={formErrors.name}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item<TProduct>
            label="Brand"
            name="brand"
            validateStatus={formErrors.brand ? 'error' : ''}
            help={formErrors.brand}
          >
            <Input placeholder="Enter product brand" />
          </Form.Item>

          <Form.Item<TProduct>
            label="Price"
            name="price"
            validateStatus={formErrors.price ? 'error' : ''}
            help={formErrors.price}
          >
            <InputNumber style={{ width: '100%' }} placeholder="Enter product price" />
          </Form.Item>

          <Form.Item<TProduct>
            label="Category"
            name="category"
            validateStatus={formErrors.category ? 'error' : ''}
            help={formErrors.category}
          >
            <Select options={productsOption} placeholder="Select product category" />
          </Form.Item>

          <Form.Item<TProduct>
            label="Description"
            name="description"
            validateStatus={formErrors.description ? 'error' : ''}
            help={formErrors.description}
          >
            <Input placeholder="Enter product description" />
          </Form.Item>

          <Form.Item<TProduct>
            label="Quantity"
            name="quantity"
            validateStatus={formErrors.quantity ? 'error' : ''}
            help={formErrors.quantity}
          >
            <InputNumber placeholder="Enter product quantity" />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit" disabled={loading}>
              {loading ? <Spin /> : 'Submit'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProductModel;
