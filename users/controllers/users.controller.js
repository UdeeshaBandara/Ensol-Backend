const user = require("../../models/index.models").user;
const notificationModel = require("../../models/index.models").notification;

const crypto = require('crypto');
const notification = require('../../push_notifications/notification.send');
const nodemailer = require('nodemailer');

exports.insert = (req, res) => {

    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;


    user.create({
        name: req.body.name,
        address: req.body.address,
        email: req.body.email,
        password: req.body.password,
        fcm: req.body.fcm,
        telephone: req.body.telephone
    }).then((result) => {
        res.status(201).send({status: true, data: result});
    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to save user " + err.message});


    });

};

exports.sendOTP = (req, res) => {

    user.findOne({
        where: {
            email: req.body.email
        }
    }).then((result) => {
        if (result == null) {
            res.status(200).send({status: false, data: "Invalid Email!!"});
        } else {

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'nibmprojectreset@gmail.com',
                    pass: 'projectpassword'
                }
            });

            const otp = Math.floor(100000 + Math.random() * 900000)
            const mailOptions = {
                from: 'nibmprojectreset@gmail.com',
                to: 'udeeshabandara@gmail.com',
                text: 'Hi ' + result.name + '!! \nYour OTP code is ' + otp+" \nThank you",
                subject: 'Ensol Password Assist'
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    res.status(200).send({status: false, data: "Please try again"});
                } else {
                    res.status(200).send({
                        status: true,
                        data: {"OTP": otp,userId : result.id},message: "Please check your email inbox"
                    });
                }
            });

        }

    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to get user"});

    });

};

exports.get = (req, res) => {

    user.findAll({
        where: {
            email: req.body.email
        }
    }).then((result) => {
        res.status(200).send({status: true, data: result});
    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to reset password"});

    });

};

exports.patchById = (req, res) => {


    user.update(req.body, {
        where: {
            id: req.jwt.userId
        }
    }).then((result) => {
        console.log(result);

        res.status(200).send({status: true, data: result});

    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to update user"});


    });


};


exports.getNotification = (req, res) => {
    notificationModel.findAll({
        where: {
            userId: req.jwt.userId
        }
    }).then((result) => {

        res.status(200).send({status: true, data: result});

    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to get notifications"});


    });


};