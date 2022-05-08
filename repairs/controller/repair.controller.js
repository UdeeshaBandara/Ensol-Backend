const repair = require("../../models/models.index").repair;


exports.insert = (req, res) => {


    repair.create({
        description: req.body.description,

        machineId: req.body.machineId,
        orderId: req.body.orderId
    }).then((result) => {
        res.status(201).send({status: true, data: result});
    }).catch(err => {
        console.log(err.message)
        res.status(200).send({status: false, data: "Failed to save repair"});
    });

};

exports.get = (req, res) => {

    repair.findOne({
        where: {
            id: req.params.id,
            status : 1
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

    repair.findAll({   where: {

            status : 1
        }}).then((result) => {
        res.status(200).send({status: true, data: result});
    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to retrieve repair"});


    });

};

exports.patchById = (req, res) => {


    repair.update(req.body, {
        where: {
            id: req.params.id,
            status : 1
        }
    }).then((result) => {


        if(!result[0])

            res.status(200).send({status: false,data:"Failed to update repair details"});
        else
            res.status(200).send({status: true,data:"Update successfully"});

    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to update repair"});


    });


};

exports.disableById = (req, res) => {


    repair.update({ status: 0 }, {
        where: {
            id: req.params.id
        }
    }).then((result) => {


        if(!result[0])

            res.status(200).send({status: false,data:"Failed to delete repair details"});
        else
            res.status(200).send({status: true,data:"Delete successfully"});

    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to delete repair"});



    });


};


exports.sendNotification = (req, res) => {

    notification.sendNotification(req.body.message, function (response) {
        res.status(200).send({notification: false, response});
    });


};