import express from 'express'
import { orderController } from './order.controller';
import auth from '../../middlewire/auth';

const router = express.Router();
//All Order related routes
router.post('/',auth() ,orderController.createOrder);
router.get('/', orderController.getAllOrder);
router.get('/revenue', orderController.getTotalRevenueController);

export const orderRoutes = router;