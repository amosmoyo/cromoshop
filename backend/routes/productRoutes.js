const express = require("express");
const asyncHandler = require('express-async-handler')

const Products = require("../model/productsModel");

const {getProducts, getProduct, deleteProduct, createProduct, updateProduct, createProductReview, getTopRatedProducts} = require('../controller/productController');

const {protect, adminPrivilages} = require('../middleware/auth')

const router = express.Router();

// @desc Get all products
// @Routes /api/v1/products
// access Public
// router.get("/", asyncHandler(async (req, res) => {
//     console.log(req.originalUrl)
//     const products = await Products.find();
//     res.status(200).json({
//       status: "success",
//       products,
//     });
// }));

router.route('/').get(getProducts);

router.route('/top').get(getTopRatedProducts)

// @desc Get all products
// @Routes /api/v1/products/:id
// access Public
// router.get("/details/:id", asyncHandler(async (req, res) => {
//     const product = await Products.findById(req.params.id);
    
//     if(!product) {
//         res.status(404);
//         throw new Error('Product not found')
//     }
//     res.status(200).json({
//       status: "success",
//       product,
//     });
  
// }));

router.route('/details/:id').get(getProduct);

router.route('/delete/:id').delete(protect, adminPrivilages, deleteProduct);

router.route('/create').post(protect, adminPrivilages, createProduct )

router.route('/update/:id').put(protect, adminPrivilages, updateProduct);

router.route('/create/:id/reviews').post(protect, createProductReview)

module.exports = router;
