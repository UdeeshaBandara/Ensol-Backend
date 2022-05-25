const repair = require("../../models/index.models").repair;
const order = require("../../models/index.models").order;
const user = require("../../models/index.models").user;
const notificationModel = require("../../models/index.models").notification;
const notification = require("../../push_notifications/notification.send");
const {sequelize} = require("../../models/index.models");

exports.insert = (req, res) => {


    repair.create({
        description: req.body.description,

        machineId: req.body.machineId,
        orderId: req.body.orderId
    }).then((result) => {
        res.status(201).send({status: true, data: result});
    }).catch(err => {

        res.status(200).send({status: false, data: "Failed to save repair"});
    });

};

exports.get = (req, res) => {

    repair.findOne({
        include:
            [
                {
                    association: 'order',
                    include:
                        [

                            {
                                association: 'user',
                                attributes: {exclude: ['password', 'status', 'fcm']}
                            },
                        ]


                },
                {
                    association: 'machine', attributes: {
                        include: [
                            [
                                sequelize.literal(`(select contractStartDate from ordermachines where machineId = repair.machineId AND orderId = repair.orderId)`),
                                'contractStartDate'

                            ], [
                                sequelize.literal(`(select contractEndDate from ordermachines where machineId = repair.machineId AND orderId = repair.orderId)`),
                                'contractEndDate'

                            ]
                        ]
                    }
                }],

        where: {
            id: req.params.id
        }
    }).then((result) => {
        if (result == null) {

            res.status(200).send({status: false, data: "Invalid repair id"});
        } else {
            res.status(200).send({status: true, data: result});
        }
    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to get repair"});


    });

};
exports.getAll = (req, res) => {

    repair.findAll({
        where: {
            ['$order.user.id$']: req.jwt.userId
        },
        include:
            [
                {
                    association: 'order',
                    include: user,
                },
                {association: 'machine'},
            ],
        order: [
            [sequelize.literal('createdAt'), 'DESC']
        ]

    }).then((result) => {
        res.status(200).send({status: true, data: result});
    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to retrieve repair - " + err.message});


    });

};

exports.patchById = async (req, res) => {


    repair.update(req.body, {

        where: {
            id: req.params.id
        }
    }).then(async (result) => {

        let repairs = await repair.findByPk(req.params.id, {
            include: [
                {
                    model: order,
                    include: [{
                        model: user
                    }
                    ]
                }
            ]
        });
        if (repairs.status === 0) {
            await notification.sendNotification(repairs.order.user.fcm, "Repair cancelled", "Your repair request has been cancelled. \nRepair #ENR" + req.params.id, async function () {
                await notificationModel.create({
                    content: "{'title' : 'Repair cancelled','description' : 'Your repair request has been cancelled. \nRepair #ENR" + req.params.id + "'}",

                    userId: repairs.order.user.id
                })

            });
        } else if (repairs.status === 1) {
            await notification.sendNotification(repairs.order.user.fcm, "Repair completed", "Your repair has been completed. Please collect your machine. \nRepair #ENR" + req.params.id, async function () {
                await notificationModel.create({
                    content: "{'title' : 'Repair completed','description' : 'Your repair has been completed. Please collect your machine. \nRepair #ENR" + req.params.id + "'}",

                    userId: repairs.order.user.id
                })

            });

        } else if (repairs.status === 2) {
            await notification.sendNotification(repairs.order.user.fcm, "Repair accepted", "Your repair request accepted. \nRepair #ENR" + req.params.id, async function () {
                await notificationModel.create({
                    content: "{'title' : 'Repair accepted','description' : 'Your repair request accepted. \nRepair #ENR" + req.params.id + "'}",

                    userId: repairs.order.user.id
                })

            });

        }

        if (!result[0])

            res.status(200).send({status: false, data: "Failed to update repair details "});
        else
            res.status(200).send({status: true, data: "Update successfully "});

    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to update repair "});


    });


};

exports.disableById = (req, res) => {


    repair.update({status: 0}, {
        where: {
            id: req.params.id
        }
    }).then((result) => {


        if (!result[0])

            res.status(200).send({status: false, data: "Failed to delete repair details"});
        else
            res.status(200).send({status: true, data: "Delete successfully"});

    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to delete repair"});


    });


};

