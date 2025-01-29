import express from 'express'
import { orderController } from './order.controller';

const router = express.Router();
//All Order related routes
router.post('/' ,orderController.createOrder);
router.get('/', orderController.getAllOrder);
router.delete('/:id', orderController.deleteOrder);
router.put('/:id', orderController.updateOrder);
router.get('/revenue', orderController.getTotalRevenueController);

export const orderRoutes = router;