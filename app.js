const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParse = require('body-parser');
const mongoose = require('mongoose');
const config = require('./api/config');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes=require('./api/routes/user');
app.set('pw',config.password)
mongoose.connect(
    "mongodb://admin:"+app.get('pw')+"@node-restful-api-shard-00-00-zahhj.mongodb.net:27017,node-restful-api-shard-00-01-zahhj.mongodb.net:27017,node-restful-api-shard-00-02-zahhj.mongodb.net:27017/test?ssl=true&replicaSet=node-restful-api-shard-0&authSource=admin&retryWrites=true"
  );


app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    console.log('Time', Date.now());
    const error = new Error('Not found!');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
