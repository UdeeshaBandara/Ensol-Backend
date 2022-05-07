const machine = require("../../models/models.index").machine;


exports.insert = (req, res) => {


    machine.create({
        serialNumber: req.body.serialNumber,
        machineType: req.body.machineType,
        availableQty: req.body.availableQty,
        rentPrice: req.body.rentPrice,
        status: req.body.status
    }).then((result) => {
        res.status(201).send({status: true, data: result});
    }).catch(err => {
        console.log(err.message)
        res.status(200).send({status: false, data: "Failed to save machine"});
    });

};

exports.get = (req, res) => {

    machine.findOne({
        where: {
            id: req.params.id
        }
    }).then((result) => {
        res.status(200).send({status: true, data: result});
    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to get machine"});


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