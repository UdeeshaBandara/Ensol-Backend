const jwtSecret = require('../../config/env.config.js').jwt_secret,
    jwt = require('jsonwebtoken');
const crypto = require('crypto');
const user = require("../../models/index.models").user;
const uuid = require('uuid');

exports.login = (req, res) => {
    try {
        let refreshId = req.body.userId + jwtSecret;
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
        req.body.refreshKey = salt;
        let token = jwt.sign(req.body, jwtSecret);
        let b = Buffer.from(hash);
        let refresh_token = b.toString('base64');


        user.update({fcm: req.body.fcm}, {
            where: {
                email: req.body.email
            }
        }).then((result) => {
            console.log(result);

            res.status(200).send({status: true, accessToken: token, refreshToken: refresh_token});

        }).catch(err => {
            err.errors.map(e =>
                res.status(200).send({
                    status: false,
                    message: e.message
                }));
        });

    } catch (err) {
        res.status(200).send({status: false, errors: err});
    }
};

exports.refresh_token = (req, res) => {
    try {
        req.body = req.jwt;
        let token = jwt.sign(req.body, jwtSecret);
        res.status(201).send({id: token});
    } catch (err) {
        res.status(200).send({status: false, errors: err});
    }
};
exports.revokeFCM = (req, res) => {
    try {
        user.update({fcm: ""}, {
            where: {
                id: req.jwt.userId
            }
        }).then((result) => {

            res.status(200).send({status: true});

        });


    } catch (err) {
        res.status(200).send({status: false});
    }
};exports.welcome = (req, res) => {
    try {

        res.status(200).send({"message": "Ensol up and running!!!"});
    } catch (err) {
        res.status(200).send({status: false, errors: err});
    }
};
