const {Op} = require("sequelize");
const machine = require("../../models/index.models").machine;
const repair = require("../../models/index.models").repair;
const user = require("../../models/index.models").user;
const orderMachines = require("../../models/index.models").orderMachines;
const moment = require('moment');


exports.dashboardValues = async (req, res) => {
    try {


        let topValues = {
            total_machines: await machine.count({
                col: 'id'
            }),
            repair_count: await repair.count({
                col: 'id'
            }),
            user_count: await user.count({
                col: 'id',
                where: {userType: "0"},
            }),
            rented_machines: await orderMachines.sum('quantity', {
                where: {
                    contractStartDate: {[Op.lte]: moment().format('yyyy-MM-DD HH:mm:ss')},
                    contractEndDate: {[Op.gte]: moment().format('yyyy-MM-DD HH:mm:ss')}
                }
            })


        }

        let orders = await order.findAll({
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
        })

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
        res.status(200).send({status: true, data: {top_values: topValues, orders: orders}});


    } catch (err) {
        res.status(200).send({status: false, data: "Failed to retrieve data"});
    }
};
