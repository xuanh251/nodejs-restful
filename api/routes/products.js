const express = require('express');
const router = express.Router();
const multer = require('multer');
const dateFormat = require('dateformat');
const checkAuth = require('../middleware/check-auth');
const productController=require('../controller/product');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        var now = new Date();
        var dateString = dateFormat(now, "ddmmyyyyHHMMss");
        cb(null, dateString + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({
    storage: storage, limits: {
        fileSize: 1020 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/', checkAuth, productController.product_get_all);

router.post('/', checkAuth, upload.single('productImage'), productController.product_create);

router.get('/:productId', checkAuth, productController.product_get_by_id);

router.patch('/:productId', checkAuth, productController.product_update);

router.delete('/:productId', checkAuth, productController.product_delete);

module.exports = router;