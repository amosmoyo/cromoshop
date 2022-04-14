const dotenv = require("dotenv");

dotenv.config();

const express = require("express");

const cors = require("cors");

const cookieParser = require("cookie-parser");

const database = require("./configs/db");

const { errorHandler, notFound } = require("./middleware/errorMiddleware");

const colors = require("colors");

const products = require("./data/products");

const auth = require("./routes/auth");

const order = require("./routes/orders");

const fileUpload = require("./routes/upload");

const path = require("path");

const fileuploadAvatar = require('express-fileupload')


// const patt1 = require('./../frontend/build')

// const cors = require('cors');

const productsRoutes = require("./routes/productRoutes");

database();

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  credentials: true,
  origin: [`${process.env.CLIENT_URL}`, "http://localhost:3000"],
  // origin: true
};

app.use(cors(corsOptions));

// app.options('*', cors(corsOptions))


// prevent CORS problems
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT ,DELETE");
//   res.header("Access-Control-Allow-Credentials", true);
//   next();
// });



app.use(errorHandler);


app.use(cookieParser())



app.use("/api/v1/products", productsRoutes);

app.use("/api/v1/order", order);

app.use("/api/v1/upload", fileUpload);

app.use(fileuploadAvatar(
  {
    useTempFiles: true
  }
))

app.use("/api/v1/auth", auth);
// app.use(notFound)

// const data = JSON.stringify(products)

const port = process.env.PORT || 5000;


// const __dirname = path.resolve()

// const __dirname = path.resolve()
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// paypal config route
app.get("/api/v1/config", (req, res) => res.send(process.env.PAYPAL_CLIENT_ID));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname + "./../frontend/build")));

  app.get("/*", (req, res) =>
    res.sendFile(path.resolve(__dirname + "./../frontend/build/index.html"))
  );
} else {
  app.get("/", (req, res) => res.send("API is running"));
}

// custom error handler
// app.use(notFound);
// app.use(errorHandler);

app.listen(port, console.log(`app running  on port ${port}`.yellow.bold));
