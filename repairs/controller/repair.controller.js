const repair = require("../../models/index.models").repair;
const order = require("../../models/index.models").order;
const user = require("../../models/index.models").user;
const notification = require("../../push_notifications/notification.send");

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
                {association: 'order'},
                {association: 'machine'},
            ],
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
        include:
            [
                {association: 'order'},
                {association: 'machine'},
            ],
    }).then((result) => {
        res.status(200).send({status: true, data: result});
    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to retrieve repair - " + err.message});


    });

};

exports.patchById = (req, res) => {


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
            notification.sendNotification(repairs.order.user.fcm, "Repair cancelled", "Your repair request has been cancelled", function (response) {

            });
        } else if (repairs.status === 1) {
            notification.sendNotification(repairs.order.user.fcm, "Repair completed", "Your repair has been completed. Please collect your machine", function (response) {

            });
        } else if (repairs.status === 2) {
            notification.sendNotification(repairs.order.user.fcm, "Repair pending", "Your repair request processing", function (response) {

            });
        }

        if (!result[0])

            res.status(200).send({status: false, data: "Failed to update repair details " + repairs});
        else
            res.status(200).send({status: true, data: "Update successfully " + repairs});

    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to update repair " + err.message});


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

