import { Torder } from './order.interface';
import { Order } from './order.model';

const createOrder = async (orderData: Torder) => {
  const result = await Order.create(orderData);
  return result;
};

// Calculate the total revenue
const getTotalRevenue = async () => {
  const result = await Order.aggregate([
    {
      $lookup: {
        from: 'bikes', 
        localField: 'product', 
        foreignField: '_id', 
        as: 'bikeData', 
      },
    },
    {
      $unwind: {
        path: '$bikeData',
        preserveNullAndEmptyArrays: false, 
      },
    },
    {
      $addFields: {
        totalPrice: { $multiply: ['$bikeData.price', '$quantity'] }, 
      },
    },
    {
      $group: {
        _id: null, 
        totalRevenue: { $sum: '$totalPrice' }, 
      },
    },
    {
      $project: {
        _id: 0, 
        totalRevenue: 1,
      },
    },
  ]);

  const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;
  return totalRevenue;
};

const getAllOrderFromDB = async () => {
  const result = await Order.find();
    return result;
};

export const orderService = {
  createOrder,
  getTotalRevenue,
  getAllOrderFromDB
};
