const order = require("../../models/index.models").order;
const orderMachines = require("../../models/index.models").orderMachines;
const machines = require("../../models/index.models").machine;
const notification = require("../../push_notifications/notification.send");
const Op = require('sequelize').Op;


exports.insert = (req, res) => {


    order.create({
        description: req.body.description,
        status: 0,
        price: req.body.price,
        orderDate: req.body.orderDate,
        userId: req.jwt.userId
    }).then((orderResult) => {

        req.body.machines.forEach(oneMachine => {

            machines.decrement({'availableQty': oneMachine.quantity}, {where: {id: oneMachine.machineId}}).then((result) => {
                orderMachines.create({
                    machineId: oneMachine.machineId,
                    orderId: orderResult.id,
                    quantity: oneMachine.quantity,
                    contractEndDate: oneMachine.contractEndDate
                });
            });


        });

        res.status(201).send({status: true, data: req.body});


    }).catch(err => {
        console.log(err.message)
        res.status(200).send({status: false, data: "Failed to save order"});
    });

};

exports.get = (req, res) => {

    order.findOne({
        include: {
            model: machines,
            through: {
                attributes: ['quantity', 'contractEndDate']
            }
        },
        where: {
            id: req.params.id,
            orderStatus: {[Op.ne]: 0}
        }

    }).then((result) => {
        if (result == null) {

            res.status(200).send({status: false, data: "Invalid order id"});
        } else {
            res.status(200).send({status: true, data: result});
        }
    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to get order " + err.message});


    });

};
exports.getAll = (req, res) => {

    order.findAll({
        include:
            [
                {association: 'user', attributes: {exclude: ['password', 'status', 'fcm']}},
                {association: 'machines', through: {attributes: ['quantity', 'contractEndDate']}},
            ],
        where: {
            orderStatus: {
                [Op.ne]: 0
            }
        }
    }).then((result) => {
        res.status(200).send({status: true, data: result});
    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to retrieve order"});


    });

};
exports.getAllByUserId = (req, res) => {

    order.findAll({
        include: {
            model: machines,
            through: {
                attributes: ['quantity', 'contractEndDate']
            }
        },
        where: {
            userId: req.jwt.userId,
            orderStatus: {[Op.ne]: 0}
        }
    }).then((result) => {
        res.status(200).send({status: true, data: result});
    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to retrieve order"});


    });

};

exports.patchById = (req, res) => {


    order.update(req.body, {
        where: {
            id: req.params.id
        }
    }).then((result) => {


        if (!result[0])

            res.status(200).send({status: false, data: "Failed to update order details"});
        else
            res.status(200).send({status: true, data: "Update successfully"});

    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to update order"});


    });


};

exports.disableById = (req, res) => {


    order.update({orderStatus: 0}, {
        where: {
            id: req.params.id
        }
    }).then((result) => {


        if (!result[0])

            res.status(200).send({status: false, data: "Failed to delete order details"});
        else
            res.status(200).send({status: true, data: "Delete successfully"});

    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to delete order"});


    });


};


exports.sendNotification = (req, res) => {

    notification.sendNotification(req.body.message, function (response) {
        res.status(200).send({notification: false, response});
    });


};