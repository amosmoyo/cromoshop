const asyncHandler = require("express-async-handler");

const Products = require("../model/productsModel");

const ErrorResponse = require("../utils/errorResponse");

// @desc Get all products
// @Routes /api/v1/products
// access Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword ? {
    name: {
      $regex: req.query.keyword,
      $options: 'i'
    }
  } : {};

  const count = await Products.countDocuments({...keyword})
  const products = await Products.find({...keyword}).limit(pageSize).skip(pageSize * (page - 1));

  res.status(200).json({
    status: "success",
    products,
    page,
    pages: Math.ceil(count / pageSize)
  });
});

// @desc Get all products
// @Routes /api/v1/products/details/:id
// access Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Products.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.status(200).json({
    status: "success",
    product,
  });
});

// @desc CREATE product
// @route /api/v1/products/create
// access Private
exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = new Products({
    brand: req.body.brand,
    category: req.body.category,
    countInStock: req.body.countInStock,
    description: req.body.description,
    image: req.body.image,
    name: req.body.name,
    numReviews: req.body.numReviews,
    price: req.body.price,
    rating: req.body.rating,
    user: req.user._id,
  });

  const createdProduct = await product.save();

  res.status(201).json(createdProduct);
});

// @desc POST product
// @route /api/v1/products/update/:id
// access Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const {
    brand,
    category,
    countInStock,
    description,
    image,
    name,
    numReviews,
    price,
    rating,
    reviews,
  } = req.body;

   const product = await Products.findById(req.params.id);

   if(!product) {
     return next(new ErrorResponse("Product not found", 404))
   }

   product.brand = brand || product.brand;
   product.category = category || product.category;
   product.countInStock = countInStock || product.countInStock;
   product.description = description || product.description;
   product.image = image || product.image;
   product.name = name || product.name;
   product.numReviews = numReviews || product.numReviews;
   product.price = price || product.price;
   product.rating = rating || product.rating;
   product.reviews = reviews || product.reviews;

   const updatedProduct = await product.save();

   res.json(updatedProduct);
});

// @desc DELETE product
// @routes /api/v1/products/delete/:id
// access Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Products.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse("Product not found", 404));
  }

  await product.remove();

  res.json({
    message: "product successfully removed",
  });
});

// @desc CREATE product review
// routes /api/v1/products/create/:id/reviews
// access Private
exports.createProductReview = asyncHandler( async (req, res, next) => {
  const {rating, comment} = req.body;

  const product = await Products.findById(req.params.id);

  if(product) {
    const reviewExist = product.reviews.find( r => r.user.toString() === req.user._id.toString());

    if(reviewExist) {
      // return next(new ErrorResponse("You have already reviewed the product", 400));
      return res.status(400).json({
        message: 'You have already reviewed the product'
      })
    }

    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment,
      name: req.user.name
    };

    product.reviews.push(review)

    product.numReviews = product.reviews.length;

    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();

    res.status(201).json({
      message: 'You have added a product review'
    })
  }
})

// @desc GET products
// route /api/v1/products/top
// Public
exports.getTopRatedProducts = asyncHandler( async (req, res, next) => {
  const products = await Products.find({}).sort({rating: 'desc'}).limit(3)
  res.json(products)
})
