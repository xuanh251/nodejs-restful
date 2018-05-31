const jwt = require('jsonwebtoken');
const config = require('../config');
const express = require('express');
const app = express();
app.set('key', config.secret)
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, app.get('key'));
        req.userData = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            message: 'Lệnh chưa được xác thực.'
        })
    }

}