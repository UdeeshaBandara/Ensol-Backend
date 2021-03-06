const user = require("../models/index.models").user;
const crypto = require('crypto');
const {Op} = require("sequelize");

exports.hasAuthValidFields = (req, res, next) => {

    if (req.body) {
        if (!req.body.email) {
            return res.status(200).send({status: false, data: "Email is required"});

        } else if (!req.body.password) {
            return res.status(200).send({status: false, data: "Password is required"});
        } else {
            return next();
        }
    } else {
        return res.status(200).send({status: false, data: 'Missing email and password fields'});
    }
};

exports.isPasswordAndUserMatch = (req, res, next) => {

    if (!req.body.email) {
        return res.status(200).send({status: false, data: 'Invalid e-mail'});
    }
    user.findAll({
        where: {
            email: req.body.email,
            userType : 0
        }
    }).then((result) => {


        if (!result[0]) {
            res.status(200).send({status: false, data: 'Invalid account'});
        } else if (!req.body.fcm) {
            res.status(200).send({status: false, data: 'Failed to login'});
        } else {
            let passwordFields = result[0].password.split('$');
            let salt = passwordFields[0];
            let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
            if (hash === passwordFields[1]) {
                req.body = {
                    userId: result[0].id,
                    email: result[0].email,
                    fcm: req.body.fcm,
                    name: result[0].firstName + ' ' + result[0].lastName,
                };
                return next();
            } else {
                return res.status(200).send({status: false, data: 'Invalid password'});
            }
        }

    });

};

exports.isPasswordAndAdminMatch = (req, res, next) => {

    if (!req.body.email) {
        return res.status(200).send({status: false, data: 'Invalid e-mail'});
    }
    user.findAll({
        where: {
            email: req.body.email,
            userType : 1
        }
    }).then((result) => {


        if (!result[0]) {
            res.status(200).send({status: false, data: 'Invalid account'});
        }  else {
            let passwordFields = result[0].password.split('$');
            let salt = passwordFields[0];
            let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
            if (hash === passwordFields[1]) {
                req.body = {
                    userId: result[0].id,
                    email: result[0].email,
                    name: result[0].firstName + ' ' + result[0].lastName,
                };
                return next();
            } else {
                return res.status(200).send({status: false, data: 'Invalid password'});
            }
        }

    });

};
exports.checkEmailPhoneNumber = (req, res, next) => {

    if (!req.body.email) {
        return res.status(200).send({status: false, data: 'Invalid e-mail'});
    }
    if (!req.body.telephone) {
        return res.status(200).send({status: false, data: 'Invalid telephone number'});
    }
    if (!req.body.fcm) {
        return res.status(200).send({status: false, data: 'Invalid FCM token'});
    }

    user.findAll({
        where: {
            [Op.or]: [
                {email: req.body.email},
                {telephone: req.body.telephone}
            ]
        }
    }).then((result) => {

        if (result.length >= 1) {
            res.status(200).send({status: false, data: 'E-mail or password already exist'});
        } else {

            return next();

        }

    });

};