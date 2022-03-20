const dotenv = require('dotenv');

dotenv.config();

const express = require('express')

const database = require('./configs/db');

const {errorHandler, notFound} = require('./middleware/errorMiddleware');

const colors = require('colors')

const products = require('./data/products');

const auth = require('./routes/auth');

const order = require('./routes/orders');

const fileUpload = require('./routes/upload');

const path = require('path');

// const patt1 = require('./../frontend/build')

// const cors = require('cors');

const productsRoutes = require('./routes/productRoutes')

const cors = require('cors')



database();

const app = express();

app.use(express.json())

app.use(express.urlencoded({extended: true}))

app.use(cors());

app.use(errorHandler)
// app.use(notFound)

// const data = JSON.stringify(products)

const port = process.env.PORT || 5000;

app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/auth', auth);
app.use('/api/v1/order', order);


app.use('/api/v1/upload', fileUpload)

// const __dirname = path.resolve()

// const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')) )

// paypal config route
app.get('/api/v1/config', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))

if(process.env.ENVIRONMENT === "production") {
    app.use(express.static(path.join(__dirname + './../frontend/build')));

    app.get('/*', (req, res) => res.sendFile(path.resolve(__dirname + './../frontend/buildindex.html')))
} else {
    app.get('/', (req, res) => res.send('API is running'))
}

// custom error handler
// app.use(notFound);
// app.use(errorHandler);

app.listen(port, console.log(`app running  on port ${port}`.yellow.bold))
