const user = require("../models/models.index").user;
const crypto = require('crypto');

exports.hasAuthValidFields = (req, res, next) => {
    let errors = [];

    if (req.body) {
        if (!req.body.email) {
            return res.status(200).send({status : false,message:"Email is required"});

        }
        else if (!req.body.password) {
            return res.status(200).send({status : false,message:"Password is required"});
        } else {
            return next();
        }
    } else {
        return res.status(200).send({status : false,errors: 'Missing email and password fields'});
    }
};

exports.isPasswordAndUserMatch = (req, res, next) => {

    if (!req.body.email) {
        return res.status(200).send({ status : false,message: 'Invalid e-mail'});
    }
    user.findAll({
        where: {
            email: req.body.email
        }
    }).then((result) => {


        if (!result[0]) {
            res.status(200).send({ status : false,message: 'Invalid e-mail'});
        } else  if (!req.body.fcm) {
            res.status(200).send({ status : false,message: 'Failed to login'});
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
                return res.status(200).send({ status : false,message: 'Invalid e-mail or password'});
            }
        }

    });

};