const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/products');

exports.order_get_all = (req, res, next) => {
    Order.find()
        .select('productId quantity _id')
        .populate('product', 'name')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    };
                })
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.order_create = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {//phiên bản mongodb mới hỗ trợ kiểm tra foriegnKey chỗ này lun
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Orders stored!',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.order_get_by_Id = (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .populate('product')
        .then(order => {
            if (!order) {
                return res.status(500).json({
                    message: "Không tìm thấy đơn hàng!"
                })
            }
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders'
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.order_delete = (req, res, next) => {
    Order.findByIdAndRemove(req.params.orderId)
        .then(result => {
            res.status(200).json({
                message: "Order deleted!",
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body: { productId: 'ID', quantity: 'Number' }
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}