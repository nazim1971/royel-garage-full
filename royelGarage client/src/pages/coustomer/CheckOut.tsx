import React, { useState } from 'react';
import { Button, Card, message } from 'antd';
import { useAddOrderMutation } from '../../redux/features/customer/OrderApi';
import { selectCurrentUser } from '../../redux/features/auth/authSlice';
import { useAppSelector } from '../../redux/hooks';
import { useGetProductByIdQuery } from '../../redux/features/admin/productApi';
import { useParams } from 'react-router';
import { TResponse } from '../../types/globel';



const OrderModel = () => {
  const { id } = useParams();
  const { data: productData } = useGetProductByIdQuery(id);
  const [addOrder] = useAddOrderMutation();
  const [quantity, setQuantity] = useState(1);
  const user = useAppSelector(selectCurrentUser);

  const totalPrice = productData?.data?.price ? Number(productData?.data?.price) * quantity : 0;

  const handleOrderNow =async () => {
    if (!productData?.data?.inStock) {
      message.error('This product is out of stock right now.');
      return;
    }

    if (quantity > Number(productData?.data?.quantity)) {
      message.error(`Only ${productData?.data?.quantity} available right now.`);
      return;
    }

    const orderInfo ={
      email: user?.email,
      product: id,
      quantity,
      totalPrice,
    }
    try {
      const res = await addOrder(orderInfo) 
      console.log(res);
      if (res?.error) {
        message.error('Failed to place order. Please try again.');
      } else {
        message.success('Order placed successfully!');
      }
    } catch (error) {
      message.error('An error occurred while placing your order. Please try again.');
    }
  };

  return (
    <div style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
      <Card style={{ maxWidth: '600px', width: '100%', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
          Checkout
        </h1>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{productData?.data?.name}</h2>
          <p style={{ fontSize: '16px', color: '#888', marginBottom: '10px' }}>Brand: {productData?.data?.brand}</p>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#52c41a', marginBottom: '20px' }}>
            Total: {totalPrice.toLocaleString()} BDT
          </p>

          {/* Quantity controls */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <Button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              type="default"
              style={{ fontSize: '18px' }}
            >
              -
            </Button>
            <span style={{ margin: '0 15px', fontSize: '18px' }}>{quantity}</span>
            <Button
              onClick={() => setQuantity((prev) => Math.min(Number(productData?.data?.quantity) || 1, prev + 1))}
              type="default"
              style={{ fontSize: '18px' }}
            >
              +
            </Button>
          </div>

          {/* Order Now button */}
          <Button
            type="primary"
            onClick={handleOrderNow}
            style={{ width: '100%', fontSize: '18px', padding: '10px' }}
          >
            Order Now
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OrderModel;
