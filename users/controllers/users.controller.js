const user = require("../../models/index.models").user;
const notificationModel = require("../../models/index.models").notification;

const crypto = require('crypto');
const notification = require('../../push_notifications/notification.send');
const nodemailer = require('nodemailer');
const {sequelize} = require("../../models/index.models");

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
    }).then(async (result) => {
        if (result == null) {
            res.status(200).send({status: false, data: "Cannot find a user with this email"});
        } else {

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'nibmprojectreset@gmail.com',
                    pass: 'rdjokmxeovmyjznw'
                }
            });

            const otp = Math.floor(1000 + Math.random() * 9000)
            const mailOptions = {
                from: 'nibmprojectreset@gmail.com',
                to: req.body.email,
                text: 'Hi ' + result.name + '!! \nYour OTP code is ' + otp + " \nThank you",
                subject: 'Ensol Password Assist'
            };

            const emailResponse = await transporter.sendMail(mailOptions);


            if (emailResponse.response.includes("2.0.0 OK")) {
                return res.status(200).send({
                    status: true,
                    data: {"OTP": otp, userId: result.id}, message: "Please check your email inbox"
                });
            } else {
                return res.status(200).send({
                    status: true,
                    data: "Failed to send email!! PLease try again"
                });
            }


        }

    }).catch(err => {
        console.log(err.message)
        res.status(200).send({status: false, data: "Failed to get user "});

    });

};

exports.get = (req, res) => {

    user.findOne({
        where: {
            id: req.jwt.userId
        },
        attributes: {exclude: ['password', 'fcm']}
    }).then((result) => {
        res.status(200).send({status: true, data: result});
    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to get user details"});

    });

};

exports.resetPassword = (req, res) => {

    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;

    user.update({password: req.body.password}, {
        where: {
            id: req.body.userId
        }
    }).then((result) => {


        res.status(200).send({status: true, data: "Password reset successfully,\nPlease login with new password"});

    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to update user"});


    });


};
exports.patchById = (req, res) => {

    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;

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
        },
        order: [
            [sequelize.literal('createdAt'), 'DESC']
        ],
    }).then((result) => {

        res.status(200).send({status: true, data: result});

    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to get notifications"});


    });


};