const user = require("../../models/index.models").user;
const notificationModel = require("../../models/index.models").notification;

const crypto = require('crypto');
const notification = require('../../push_notifications/notification.send');

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

exports.get = (req, res) => {

    user.findAll({
        where: {
            id: req.jwt.userId
        }
    }).then((result) => {
        res.status(200).send({status: true, data: result});
    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to get user"});

    });

};

exports.patchById = (req, res) => {


    user.update(req.body , {
        where: {
            id: req.jwt.userId
        }
    }).then((result) => {
        console.log(result);

        res.status(200).send({status: true,data:result});

    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to update user"});


    });



};



exports.getNotification = (req, res) => {
    notificationModel.findAll( {
        where: {
            userId: req.jwt.userId
        }
    }).then((result) => {

        res.status(200).send({status: true,data:result});

    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to get notifications"});


    });


};