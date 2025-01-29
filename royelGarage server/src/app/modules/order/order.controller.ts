import { NextFunction, Request, Response } from 'express';
import { orderService } from './order.service';
import { Bike } from '../bike/bike.model';
import mongoose from 'mongoose';
import { checkBikeAvailability } from '../../utilities/order/checkBikeAbility';
import { User } from '../user/user.model';

// Make order 
const createOrder = async (req: Request, res: Response, next: NextFunction) => {
 

  try {
    const { email, product, quantity, totalPrice: orderTotalPrice } = req.body;

    //is user exist
    const userExists = await User.findOne({email});
    if (!userExists) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    
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

    const orderInfo = {email, product: bike._id, quantity, totalPrice };
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

const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // Extract order ID from the route parameter

    const result = await orderService.deleteOrderById(id);

    if (!result) {
      return res.status(404).json({
        message: 'Order not found',
        status: false,
      });
    }

    return res.status(200).json({
      message: 'Order deleted successfully',
      status: true,
    });
  } catch (err) {
    next(err);
  }
};

const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // Extract order ID from the route parameter
    const { status, isCancel } = req.body; // Get status and isCancel from request body

    // Prepare update object only if the fields are provided
    const updateData: any = {};
    if (status) updateData.status = status;
    if (isCancel !== undefined) updateData.isCancel = isCancel;

    const result = await orderService.updateOrderById(id, updateData);

    if (!result) {
      return res.status(404).json({
        message: 'Order not found',
        status: false,
      });
    }

    return res.status(200).json({
      message: 'Order updated successfully',
      status: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};



export const orderController = {
  createOrder,
  getTotalRevenueController,
  getAllOrder,
  deleteOrder,
  updateOrder
};
