const express = require('express');
const app=express();
const User = require('../models/user');
const config=require('../config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

app.set('key',config.secret);
exports.user_signup=(req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length > 0) {
                return res.status(409).json({
                    message: "Đã tồn tại email!"
                })
            }
            else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    }
                    else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                res.status(200).json({
                                    message: "User created",
                                    user: result
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                })
            }
        });
}

exports.user_login=(req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(404).json({
                    message: "Mail không tồn tại"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    },
                        app.get('key'),
                        {
                            expiresIn: '1h'
                        }
                    )
                    return res.status(200).json({
                        message: "Đăng nhập thành công",
                        token: token
                    })
                }
                res.status(404).json({
                    message: "Đăng nhập không thành công"
                });
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}

exports.user_delete= (req, res, next) => {
    User.findByIdAndRemove(req.params.userId)
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User Deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}