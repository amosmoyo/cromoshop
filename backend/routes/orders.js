const express = require('express');

const {protect, adminPrivilages} = require('../middleware/auth')

const {createOrder, getOrderById, updatePaidOrder, getMyOrderList, getAllOrderList, updateDeliveredOrder} = require('../controller/orderController');

const router = express.Router();

router.route('/add').post(protect, createOrder);

router.route('/getorder/:id').get(protect, getOrderById)

router.route('/update/:id/pay').put(protect, updatePaidOrder);

router.route('/update/:id/delivered').put(protect, adminPrivilages, updateDeliveredOrder);

router.route('/myorders').get(protect, getMyOrderList);

router.route('/allorders').get(protect, adminPrivilages, getAllOrderList)

module.exports = router;
