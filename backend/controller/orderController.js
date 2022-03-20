const asyncHandler = require("express-async-handler");

const ErrorResponse = require("../utils/errorResponse");

const Order = require("../model/orderModel");

// @desc POST create orders
// @routes api/v1/orders/add
// @access Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return next(new ErrorResponse("There are no order items", 400));
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    const createOrder = await order.save();

    res.status(201).json({
        createOrder
    })
  }
});


// @desc Get orders by ID
// @routes api/v1/orders/getorder/:id
// @access Private
exports.getOrderById = asyncHandler( async (req, res, next ) => {
  const order = await Order.findById(req.params.id).populate('user', "name email")

  if(!order) {
    return next(new ErrorResponse("Not found", 404))
  }

  res.status(200).json({
    order
  })
})

exports.updatePaidOrder = asyncHandler( async (req, res, next ) => {
  const order = await Order.findById(req.params.id);

  if(!order) {
    return next(new ErrorResponse("Not found", 404))
  } else {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    }

    const updateOrder = await order.save();

    res.status(200).json({
      updateOrder
    })
  }

})

// @desc PUT update delivered orders
// routes /api/v1/orders/:id/delivered

exports.updateDeliveredOrder = asyncHandler( async (req, res, next ) => {
  const order = await Order.findById(req.params.id);

  if(!order) {
    return next(new ErrorResponse("Not found", 404))
  } else {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updateOrder = await order.save();

    res.status(200).json({
      updateOrder
    })
  }

})

// @desc Get orders 
// @routes api/v1/orders/myorders
// @access Private
exports.getMyOrderList = asyncHandler( async(req, res, next) => {
  const orders = await Order.find({user: req.user._id});

  res.status(200).json({
    orders
  })
})

// @desc Get orders 
// @routes api/v1/orders/allorders
// @access Private
exports.getAllOrderList = asyncHandler( async(req, res, next) => {
  const orders = await Order.find().populate('user', "id name");

  res.status(200).json(
    orders
  )
})