const Order = require('../models/orderModule');
const Product = require('../models/productModule');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const { create } = require('../models/orderModule');

// POST - /api/orders/
// Create new order | Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderComponents,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderComponents && orderComponents.length === 0) {
    res.status(400);
    throw new Error('There is no item to order');
  } else {
    const order = new Order({
      orderComponents,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// GET - /api/orders/:id
// Get order by id| Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found!');
  }
});

// GET - /api/orders/orderlist
// Get logged in user orders| Private - Admin
const getOrderList = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });

  res.json(orders);
});

// GET - /api/orders
// Get all orders from db | Private - Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');

  res.json(orders);
});

// PUT - /api/orders/:id/deliver
// Update order as delivered | Private - Admin
const updateIsDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
  }
  const updatedDeliver = await order.save();
  res.json(updatedDeliver);
});

// PUT - /api/orders/:id/pay
// Update order as delivered | Private - Admin
const updateIsPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
  }
  const updatedPayment = await order.save();
  res.json(updatedPayment);
});

// PUT - /api/orders/:id/request
// Update Farm Request| Public
const updateFarmRequest = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isReady = !order.isReady;
  }
  const updatedRequest = await order.save();
  res.json(updatedRequest);
});

// DELETE - /api/orders/:id
// Delete a data from Db - Private-Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    await order.remove();
    res.json({ message: 'Order successfully deleted' });
  } else {
    res.status(404);
    throw new Error('Order not found!');
  }
});

// PUT - /api/orders
// Update amount in stock
const updateStockAmount = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    amountInStock,
    qty,
    yield,
    growTime,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.amountInStock = amountInStock - qty;
    product.growTime = growTime;
    product.yield = yield;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found!');
  }
});

module.exports = {
  addOrderItems,
  getOrderById,
  getOrderList,
  getOrders,
  updateIsDelivered,
  updateIsPaid,
  deleteOrder,
  updateStockAmount,
  updateFarmRequest,
};
