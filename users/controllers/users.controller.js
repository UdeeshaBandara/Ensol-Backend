const user = require("../../models/models.index").user;

const crypto = require('crypto');
const notification = require('../../push_notifications/send');

exports.insert = (req, res) => {

    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;


    user.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName, email: req.body.email,
        password: req.body.password, fcm: req.body.fcm
    }).then((result) => {
        res.status(201).send({status: true, user: result});
    }).catch(err => {
        err.errors.map(e =>
            res.status(200).send({
                status: false,
                message: e.message
            }));


    });

};

exports.get = (req, res) => {

    user.findAll({
        where: {
            id: req.jwt.userId
        }
    }).then((result) => {
        res.status(200).send({status: true, user: result});
    }).catch(err => {
        err.errors.map(e =>
            res.status(200).send({
                status: false,
                message: e.message
            }));


    });

};

exports.patchById = (req, res) => {


    user.update(req.body , {
        where: {
            id: req.jwt.userId
        }
    }).then((result) => {
        console.log(result);

        res.status(200).send({status: true});

    }).catch(err => {
        err.errors.map(e =>
            res.status(200).send({
                status: false,
                message: e.message
            }));


    });


    // if (req.body.password) {
    //     let salt = crypto.randomBytes(16).toString('base64');
    //     let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    //     req.body.password = salt + "$" + hash;
    // }
    //
    // UserModel.patchUser(req.params.userId, req.body)
    //     .then((result) => {
    //         res.status(204).send({});
    //     });

};


exports.sendNotification = (req, res) => {

    notification.sendNotification(req.body.message, function (response) {
        res.status(200).send({notification: false, response});
    });


};