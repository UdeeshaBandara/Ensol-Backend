const {Op} = require("sequelize");
const machine = require("../../models/index.models").machine;
const repair = require("../../models/index.models").repair;
const user = require("../../models/index.models").user;
const orderMachines = require("../../models/index.models").orderMachines;
const order = require("../../models/index.models").order;
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
                ]
        })

        const repairs = await repair.findAll({
            include:
                [
                    {
                        association: 'order',
                        include: {association: 'user', attributes: {exclude: ['password', 'status', 'fcm']}},

                    },
                    {association: 'machine'},
                ],
        })
        res.status(200).send({status: true, data: {top_values: topValues, orders: orders, repairs: repairs}});


    } catch (err) {
        console.log(err.message)
        res.status(200).send({status: false, data: "Failed to retrieve data"});
    }
};
