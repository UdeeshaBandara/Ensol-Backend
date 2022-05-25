const user = require("../../models/index.models").user;
const notificationModel = require("../../models/index.models").notification;
const jwtSecret = require('../../config/env.config.js').jwt_secret,
    jwt = require('jsonwebtoken');
const crypto = require('crypto');
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
                text: 'Hello ' + result.name + '!! \nBelow is your one time verification code : \n' + otp + "\nUse the above verification code and if you are having any issues with your account, please don't hesitate to contact us through 0333330873. \n\nThank you",
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
exports.updateUserDetails = (req, res) => {

    if (req.body) {


        user.findAll({
            where: {
                email: req.body.email
            }
        }).then((result) => {


                if (!result[0]) {
                    res.status(200).send({status: false, data: 'Invalid e-mail'});
                } else {

                    let passwordFields = result[0].password.split('$');
                    let salt = passwordFields[0];
                    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
                    if (hash === passwordFields[1]) {
                        if (req.body.newPassword) {

                            let salt = crypto.randomBytes(16).toString('base64');
                            let hash = crypto.createHmac('sha512', salt).update(req.body.newPassword).digest("base64");
                            req.body.password = salt + "$" + hash;
                        } else {

                            req.body.password = result[0].password;
                        }
                        req.body.userId = result[0].id;

                        user.update(req.body, {
                            where: {
                                id: req.jwt.userId
                            }
                        }).then((result) => {
                            console.log(result);

                            res.status(200).send({status: true, data: "User details updated successfully",accessToken : jwt.sign(req.body, jwtSecret)});

                        }).catch(err => {
                            res.status(200).send({status: false, data: "Failed to update user"});


                        });


                    } else {
                        return res.status(200).send({status: false, data: 'Invalid password'});
                    }


                }


            }
        )


    }


}


exports.getNotification = (req, res) => {
    notificationModel.findAll({
        where: {
            userId: req.jwt.userId
        },
        order: [
            [sequelize.literal('createdAt'), 'DESC']
        ],
    }).then((result) => {

        if (result[0]) {
            res.status(200).send({status: true, data: result});
        } else {
            res.status(200).send({status: false, data: "No Notifications Available"});
        }

    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to get notifications"});


    });


};