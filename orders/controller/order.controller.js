const order = require("../../models/index.models").order;
const orderMachines = require("../../models/index.models").orderMachines;
const machines = require("../../models/index.models").machine;
const user = require("../../models/index.models").user;

const notificationModel = require("../../models/index.models").notification;
const notification = require("../../push_notifications/notification.send");
const {sequelize} = require("../../models/index.models");
const Op = require('sequelize').Op;


exports.insert = (req, res) => {


    order.create({
        description: req.body.description,
        price: req.body.price,
        orderDate: req.body.orderDate,
        userId: req.jwt.userId
    }).then((orderResult) => {

        req.body.machines.forEach(oneMachine => {

            // machines.decrement({'availableQty': oneMachine.quantity}, {where: {id: oneMachine.machineId}}).then((result) => {
            orderMachines.create({
                machineId: oneMachine.machineId,
                orderId: orderResult.id,
                quantity: oneMachine.quantity,
                contractStartDate: oneMachine.contractStartDate,
                contractEndDate: oneMachine.contractEndDate
            });
            // });


        });

        res.status(201).send({status: true, data: req.body});


    }).catch(err => {
        console.log(err.message)
        res.status(200).send({status: false, data: "Failed to save order"});
    });

};

exports.get = (req, res) => {

    order.findOne({
        include: [{
            model: machines, through: {
                attributes: ['quantity', 'contractStartDate', 'contractEndDate']
            }
        }, {
            model: user,
            attributes: {exclude: ['password', 'status', 'fcm']}
        }], where: {
            id: req.params.id
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
        include: [{association: 'user', attributes: {exclude: ['password', 'status', 'fcm']}}, {
            association: 'machines',
            through: {attributes: ['quantity', 'contractEndDate']}
        },],
    }).then((result) => {
        res.status(200).send({status: true, data: result});
    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to retrieve order"});


    });

};

exports.getPastOrdersByUserId = (req, res) => {

    order.findAll({
        include: {
            model: machines, through: {
                attributes: ['quantity', 'contractStartDate', 'contractEndDate']
            }
        }, where: {
            userId: req.jwt.userId, orderStatus: {[Op.or]: [0, 1]}
        },
        order: [
            [sequelize.literal('createdAt'), 'DESC']
        ]
    }).then((result) => {
        res.status(200).send({status: true, data: result});
    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to retrieve order"});


    });

};
exports.getCurrentOrdersByUserId = (req, res) => {

    order.findAll({
        include: {
            model: machines, through: {
                attributes: ['quantity', 'contractStartDate', 'contractEndDate']
            }
        }, where: {
            userId: req.jwt.userId, orderStatus: {[Op.or]: [2, 3]}
        },
        order: [
            [sequelize.literal('createdAt'), 'DESC']
        ]
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
    }).then(async (result) => {

        let orderRes = await order.findByPk(req.params.id, {
            include: [{
                model: user,

            }]
        });

        if (orderRes.orderStatus === 0) {

            await notification.sendNotification(orderRes.user.fcm, "Order cancelled", "Your order has been cancelled. \nOrder #ZES" + req.params.id, async function () {
                await notificationModel.create({
                    content: "{'title' : 'Order cancelled','description' : 'Your order has been rejected. \nOrder #ZES" + req.params.id + "'}",

                    userId: req.jwt.userId
                }, {

                    where: {
                        id: orderRes.user.id
                    }
                })

            });
        } else if (orderRes.orderStatus === 1) {

            await notification.sendNotification(orderRes.user.fcm, "Order completed", "Your order has been completed. \nOrder #ZES" + req.params.id, async function () {
                await notificationModel.create({
                    content: "{'title' : 'Order completed','description' : 'Your order has been completed. \nOrder #ZES" + req.params.id + "'}",

                    userId: req.jwt.userId
                }, {

                    where: {
                        id: orderRes.user.id
                    }
                })

            });
        } else if (orderRes.orderStatus === 2) {

            await notification.sendNotification(orderRes.user.fcm, "Order accepted ", "Your order has been accepted. \nOrder #ZES" + req.params.id, async function () {
                await notificationModel.create({
                    content: "{'title' : 'Order accepted','description' : 'Your order has been accepted. \nOrder #ZES" + req.params.id + "'}",

                    userId: req.jwt.userId
                }, {

                    where: {
                        id: orderRes.user.id
                    }
                })

            });
        }
        if (!result[0])

            res.status(200).send({
                status: false,
                data: "Failed to update order details"
            }); else res.status(200).send({status: true, data: "Update successfully"});

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

            res.status(200).send({
                status: false,
                data: "Failed to delete order details"
            }); else res.status(200).send({status: true, data: "Delete successfully"});

    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to delete order"});


    });


};


