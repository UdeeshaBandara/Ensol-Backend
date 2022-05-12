const machine = require("../../models/index.models").machine;


exports.insert = async (req, res) => {


    const savedMachine = await machine.create({
        serialNumber: req.body.serialNumber,
        machineType: req.body.machineType,
        availableQty: req.body.availableQty,
        rentPrice: req.body.rentPrice,
        status: req.body.status,
        description: req.body.description
    });

    let fileUrls = [];
    for (let i = 0; i < req.files.length; i++) {
        await req.app.locals.bucket.file(savedMachine.id.toString() + '_' + i + '.' + req.files[i].originalname.split('.').pop()).createWriteStream().end(req.files[i].buffer)

        const file = req.app.locals.bucket.file(savedMachine.id.toString() + '_' + i + '.' + req.files[i].originalname.split('.').pop());
        let nice = await file.getSignedUrl({
            action: 'read',
            expires: '03-09-2491'
        });

       fileUrls.push(nice[0].toString());


    }

    machine.update({images: JSON.stringify(fileUrls).toString()}, {
        where: {
            id: savedMachine.id
        }
    }).then((result) => {


        if (!result[0])

            res.status(200).send({status: false, data: "Failed to save machine details"});
        else
            res.status(201).send({status: true, data: "Added successfully"});

    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to update machine"});


    });

};

async function  getUrlList()  {



}

exports.uploadImage = async (req, res) => {


};


exports.get = (req, res) => {

    machine.findOne({
        where: {
            id: req.params.id,
            status: 1
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

    machine.findAll({
        where: {

            status: 1
        }
    }).then((result) => {
        res.status(200).send({status: true, data: result});
    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to retrieve machine"});


    });

};

exports.patchById = (req, res) => {


    machine.update(req.body, {
        where: {
            id: req.params.id,
            status: 1
        }
    }).then((result) => {


        if (!result[0])

            res.status(200).send({status: false, data: "Failed to update machine details"});
        else
            res.status(200).send({status: true, data: "Update successfully"});

    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to update machine"});


    });


};

exports.disableById = (req, res) => {


    machine.update({status: 0}, {
        where: {
            id: req.params.id
        }
    }).then((result) => {


        if (!result[0])

            res.status(200).send({status: false, data: "Failed to delete machine details"});
        else
            res.status(200).send({status: true, data: "Delete successfully"});

    }).catch(err => {
        res.status(200).send({status: false, data: "Failed to delete machine"});


    });


};


exports.sendNotification = (req, res) => {

    notification.sendNotification(req.body.message, function (response) {
        res.status(200).send({notification: false, response});
    });


};