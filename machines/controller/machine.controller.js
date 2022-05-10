
const machine = require("../../models/models.index").machine;


exports.insert = (req, res) => {


    machine.create({
        serialNumber: req.body.serialNumber,
        machineType: req.body.machineType,
        availableQty: req.body.availableQty,
        rentPrice: req.body.rentPrice,
        status: req.body.status,
        images: req.body.images,
        description: req.body.description
    }).then((result) => {
        res.status(201).send({status: true, data: result});
    }).catch(err => {
        console.log(err.message)
        res.status(200).send({status: false, data: "Failed to save machine"});
    });

};

exports.uploadImage = async  (req, res) => {


    await req.app.locals.bucket.file(req.file.originalname).createWriteStream().end(req.file.buffer)

    const file = req.app.locals.bucket.file(req.file.originalname);
    return file.getSignedUrl({
        action: 'read',
        expires: '03-09-2491'
    }).then(signedUrls => {
        res.send({'done':signedUrls[0],"other":signedUrls});
    });


};


exports.get = (req, res) => {

    machine.findOne({
        where: {
            id: req.params.id,
            status : 1
        }
    }).then((result) => {
        if (result == null) {

            res.status(200).send({status: false, data: "Invalid machine id"});
        } else {
            res.status(200).send({status: true, data: result});
        }
    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to get machine"});


    });

};
exports.getAll = (req, res) => {

    machine.findAll({   where: {

            status : 1
        }}).then((result) => {
        res.status(200).send({status: true, data: result});
    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to retrieve machine"});


    });

};

exports.patchById = (req, res) => {


    machine.update(req.body, {
        where: {
            id: req.params.id,
            status : 1
        }
    }).then((result) => {


        if(!result[0])

            res.status(200).send({status: false,data:"Failed to update machine details"});
        else
            res.status(200).send({status: true,data:"Update successfully"});

    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to update machine"});


    });


};

exports.disableById = (req, res) => {


    machine.update({ status: 0 }, {
        where: {
            id: req.params.id
        }
    }).then((result) => {


        if(!result[0])

            res.status(200).send({status: false,data:"Failed to delete machine details"});
        else
            res.status(200).send({status: true,data:"Delete successfully"});

    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to delete machine"});



    });


};


exports.sendNotification = (req, res) => {

    notification.sendNotification(req.body.message, function (response) {
        res.status(200).send({notification: false, response});
    });


};