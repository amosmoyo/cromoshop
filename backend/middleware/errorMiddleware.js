const ErrorResponse = require('../utils/errorResponse');


const notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`)

    res.status(404);
    
    next(error)
}

// const errorHandler = (err, req, res, next) => {
//     let error = { ...err };

//     error.message = err.message;
  
//     // Log to console for dev
//     console.log(err.name, 'amos');
  
//     // Mongoose bad ObjectId
//     if (err.name === 'CastError') {
//       const message = `Resource not found`;
//       error = new ErrorResponse(message, 404);
//     }
  
//     // Mongoose duplicate key
//     if (err.code === 11000) {
//       const message = 'Duplicate field value entered';
//       error = new ErrorResponse(message, 400);
//     }
  
//     // Mongoose validation error
//     if (err.name === 'ValidationError') {
//       const message = Object.values(err.errors).map(val => val.message);
//       error = new ErrorResponse(message, 400);
//     }
  
//     res.status(error.statusCode || 500).json({
//       success: false,
//       error: error.message || 'Server Error'
//     });
// }

const errorHandler = (err, req, res, next) => {
  console.log(err, "amos")
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
}

module.exports = {
    notFound, errorHandler
}