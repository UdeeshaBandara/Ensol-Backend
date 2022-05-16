const {jwt_secret: jwtSecret} = require("../../config/env.config");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const {user} = require("../../models/index.models");
const machine = require("../../models/index.models").machine;


exports.dashboardValues = async (req, res) => {
    try {

    let machineCount = await machine.count({
            col: 'id'
        });

        // user.update({fcm: req.body.fcm}, {
        //     where: {
        //         email: req.body.email
        //     }
        // }).then((result) => {
        //     console.log(result);
        //
        //
        // }).catch(err => {
        //     err.errors.map(e =>
        //         res.status(200).send({
        //             status: false,
        //             message: e.message
        //         }));
        // });
        res.status(200).send({status: true, data : {total_machine: machineCount,}});


    } catch (err) {
        res.status(200).send({status: false, errors: err});
    }
};
