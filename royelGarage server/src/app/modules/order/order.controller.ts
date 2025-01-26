import { NextFunction, Request, Response } from 'express';
import { orderService } from './order.service';
import { Bike } from '../bike/bike.model';
import mongoose from 'mongoose';
import { checkBikeAvailability } from '../../utilities/order/checkBikeAbility';

// Make order 
const createOrder = async (req: Request, res: Response, next: NextFunction) => {
 

  try {
    const { email, product, quantity, totalPrice: orderTotalPrice } = req.body;
    // Check bike availability
    const availabilityError = await checkBikeAvailability(product, quantity);
    if (availabilityError) {
      return res
        .status(404)
        .json({ message: availabilityError, success: false });
    }

    const [bike] = await Bike.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(product) } },
      {
        $project: {
          price: 1,
          quantity: 1,
          isStock: 1,
          totalPrice: { $multiply: ['$price', quantity] },
        },
      },
    ]);

    const totalPrice = orderTotalPrice || bike.totalPrice;

    // Update bike quantity and stock status
    const updatedQuantity = bike.quantity - quantity;

    await Bike.updateOne(
      { _id: product },
      { $set: { quantity: updatedQuantity, inStock: updatedQuantity > 0 } },
    );

    const orderInfo = { email, product: bike._id, quantity, totalPrice };
    const result = await orderService.createOrder(orderInfo);

    return res.status(201).json({
      message: 'Order created successfully',
      success: true,
      data: result,
    });
  } catch (err) {
   next(err)
  }
};

// Get total revenue
const getTotalRevenueController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalRevenue = await orderService.getTotalRevenue(); 
    return res.status(200).json({
      message: 'Revenue calculated successfully',
      status: true,
      data: {
        totalRevenue, 
      },
    });
  } catch (err) {
    next(err)
   }
};

//Get All Order data
const getAllOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderService.getAllOrderFromDB();
    if (result.length === 0) {
      return res.status(404).json({
        message: 'Not Order Found',
        status: false,
        data: result,
      });
    }
    return res.status(200).json({
      message: 'Orders retrieved successfully',
      status: true,
      data: result,
    });
  } catch (err) {
    next(err)
   }
};

export const orderController = {
  createOrder,
  getTotalRevenueController,
  getAllOrder,
};
