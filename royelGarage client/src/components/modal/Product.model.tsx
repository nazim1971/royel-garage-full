import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, message, Modal, Select, Spin } from 'antd';
import { useAddProductMutation, useUpdateProductMutation } from '../../redux/features/admin/productApi';
import { productsOption, TProduct } from '../../types/products.types';
import { TResponse } from '../../types/globel';
import { productSchema } from '../../schema/product.schema';
import { z } from 'zod';


interface ProductModelProps {
  refetch: () => void;
  isEditMode?: boolean;
  initialValues?: TProduct | null;
  open: boolean;
  onClose: () => void;
}



const ProductModel: React.FC<ProductModelProps> = ({ refetch, isEditMode = false, initialValues, open, onClose  }) => {
  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [form] = Form.useForm<TProduct>();
  const [formErrors, setFormErrors] = useState<any>({});
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    if (isEditMode && initialValues) {
      form.setFieldsValue(initialValues); // Set the form fields for editing
    } else {
      form.resetFields(); // Reset fields if adding new product
    }
  }, [isEditMode, initialValues, form]);

  const onFinish = async (values: TProduct) => {
    try {
      setLoading(true); // Set loading to true when the form is submitted
      setFormErrors({});
      productSchema.parse(values);

      const productsData = {
        name: values.name,
        brand: values.brand,
        model: values.model,
        price: values.price,
        category: values.category,
        description: values.description,
        quantity: values.quantity,
        isStock: true,
      };
      let res: TResponse;
    if (isEditMode && initialValues) {
      res = await updateProduct({ id: initialValues._id, productData: productsData });
    } else {
      res = await addProduct(productsData);
    }

      if (res?.error) {
        message.error(res.error?.data?.message || 'Failed to submit product.');
      } else {
        message.success(res.data?.message || `Product ${isEditMode ? 'updated' : 'added'} successfully!`);
        form.resetFields(); // Reset fields after successful submission
        refetch();
        onClose() // Close modal after submission
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

  

  return (
    <>
      <Modal
        title={isEditMode ? 'Update Product' : 'Add Product'}
        open={open}
        onCancel={onClose}
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
            label="Model"
            name="model"
            validateStatus={formErrors.brand ? 'error' : ''}
            help={formErrors.model}
          >
            <Input placeholder="Enter product model" />
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
