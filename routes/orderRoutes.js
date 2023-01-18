const express = require('express');
const {
  addOrderItems,
  getOrderById,
  getOrderList,
  getOrders,
  updateIsDelivered,
  updateIsPaid,
  deleteOrder,
  updateStockAmount,
  updateFarmRequest,
} = require('../controllers/orderController');
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

const router = express.Router();

// Routes
router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/orderlist').get(protect, getOrderList);
router
  .route('/:id')
  .get(protect, getOrderById)
  .delete(protect, admin, deleteOrder)
  .put(protect, updateStockAmount);
router.route('/:id/deliver').put(protect, admin, updateIsDelivered);
router.route('/:id/pay').put(protect, admin, updateIsPaid);
router.route('/:id/request').put(protect, updateFarmRequest);

module.exports = router;
