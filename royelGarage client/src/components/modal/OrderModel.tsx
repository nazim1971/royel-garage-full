// import React, { useEffect, useState } from 'react';
// import { Button, Form, Input, InputNumber, message, Modal, Spin } from 'antd';
// import { TResponse } from '../../types/globel';
// import { z } from 'zod';
// import { useAddOrderMutation } from '../../redux/features/customer/OrderApi';
// import { TOrder } from '../../types/order.types';
// import { OrderSchema } from '../../schema/order.schema';
// import { TProduct } from '../../types/products.types';
// import { selectCurrentUser } from '../../redux/features/auth/authSlice';
// import { useAppSelector } from '../../redux/hooks';
// import { useGetProductByIdQuery } from '../../redux/features/admin/productApi';
// import { useParams } from 'react-router';


// // Props type definition for OrderModel component
// interface OrderModelProps {
//   refetch: () => void;
//   open: boolean;
//   onClose: () => void;
//   product: TProduct
// }

// // Refactored OrderModel component
// const OrderModel: React.FC<OrderModelProps> = ({  product }) => {
//   const {id} = useParams();
//   const {data: data} = useGetProductByIdQuery(id)
//   const [addOrder] = useAddOrderMutation();

//   const [quantity, setQuantity] = useState(1);
//   const totalPrice = data?.price ? Number(data?.price) * quantity : 0;
//   const user = useAppSelector(selectCurrentUser)


//   const handleOrderNow = () => {
//     if (!data?.inStock) {
//       message.error("This product is out of stock right now.");
//       return;
//     }

//     if (quantity > Number(data.quantity)) {
//       toast.error(`Only ${data.quantity} available right now.`);
//       return;
//     }

//     console.log({
//       email: user?.email,
//       productId: id,
//       quantity,
//       totalPrice,
//     });

//     message.success("Order placed successfully!");
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 flex justify-center">
//     <Card className="max-w-4xl w-full p-6 shadow-lg">
//       <h1 className="text-3xl font-bold text-center mb-6">Checkout</h1>
//       <div className="flex flex-wrap md:flex-nowrap gap-6">


//         <div className="flex-1">
//           <h2 className="text-2xl font-semibold">{product?.name}</h2>
//           <p className="text-lg text-gray-600 mt-2">
//             Brand: {product?.brand}
//           </p>
//           <p className="text-xl font-bold text-green-600 mt-2">
//             Total: {totalPrice.toLocaleString()} BDT
//           </p>

//           <div className="mt-6 flex items-center gap-4">
//             <Button
//               variant="outline"
//               className="text-xl px-4 py-2"
//               onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
//             >
//               -
//             </Button>
//             <span className="text-lg font-medium">{quantity}</span>
//             <Button
//               variant="outline"
//               className="text-xl px-4 py-2"
//               onClick={() =>
//                 setQuantity((prev) =>
//                   Math.min(Number(product?.quantity) || 1, prev + 1)
//                 )
//               }
//             >
//               +
//             </Button>
//           </div>

//           <Button
//             onClick={handleOrderNow}
//             className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-lg py-3 rounded-lg"
//           >
//             Order Now
//           </Button>
//         </div>
//       </div>
//     </Card>
//   </div>
//   );
// };

// export default OrderModel;
