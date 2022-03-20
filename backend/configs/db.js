const mongoose = require('mongoose');

// const dotenv = require('dotenv');

// dotenv.config();


const connectionDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URI}`, {
            useUnifiedTopology: true,
            // useCreateIndex:true,
            useNewUrlParser: true
        })

        console.log(`MongoDb successful connected ${conn.connection.host}`.cyan.underline.blue)
    } catch (error) {
        console.log(`${error.message}`.red.bold);
        process.exit(1)
    }
}

module.exports = connectionDB;