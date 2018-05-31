const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const OrderController = require('../controller/order');

router.get('/', checkAuth, OrderController.order_get_all);

router.post('/', checkAuth, OrderController.order_create);

router.get('/:orderId', checkAuth, OrderController.order_get_by_Id);

router.delete('/:orderId', checkAuth,OrderController.order_delete);

module.exports = router;