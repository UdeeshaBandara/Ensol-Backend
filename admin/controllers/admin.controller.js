const {Op} = require("sequelize");
const machine = require("../../models/index.models").machine;
const repair = require("../../models/index.models").repair;
const user = require("../../models/index.models").user;
const orderMachines = require("../../models/index.models").orderMachines;
const order = require("../../models/index.models").order;
const moment = require('moment');
const {sequelize} = require("../../models/index.models");


exports.dashboardValues = async (req, res) => {
    try {


        let topValues = {
            total_machines: await machine.sum('availableQty'),
            repair_count: await repair.count({
                col: 'id'
            }),
            user_count: await user.count({
                col: 'id', where: {userType: "0"},
            }),
            rented_machines: await orderMachines.sum('quantity', {
                where: {
                    contractStartDate: {[Op.lte]: moment().format('yyyy-MM-DD HH:mm:ss')},
                    contractEndDate: {[Op.gte]: moment().format('yyyy-MM-DD HH:mm:ss')}
                }
            })


        }

        let orders = await order.findAll({
            include: [{association: 'user', attributes: {exclude: ['password', 'status', 'fcm']}}, {
                association: 'machines', through: {attributes: ['quantity', 'contractStartDate', 'contractEndDate']}
            },], order: [[sequelize.literal('createdAt'), 'DESC']],
        })

        const repairs = await repair.findAll({
            include: [{
                association: 'order', include: [

                    {
                        association: 'user', attributes: {exclude: ['password', 'status', 'fcm']}
                    },]


            }, {
                association: 'machine', attributes: {
                    include: [[sequelize.literal(`(select contractStartDate from ordermachines where machineId = repair.machineId AND orderId = repair.orderId)`), 'contractStartDate'

                    ], [sequelize.literal(`(select contractEndDate from ordermachines where machineId = repair.machineId AND orderId = repair.orderId)`), 'contractEndDate'

                    ]]
                }
            }], order: [[sequelize.literal('createdAt'), 'DESC']],

        });
        res.status(200).send({status: true, data: {top_values: topValues, orders: orders, repairs: repairs}});


    } catch (err) {
        console.log(err.message)
        res.status(200).send({status: false, data: "Failed to retrieve data"});
    }
};
exports.getOrdersByDate = async (req, res) => {
    try {


        let orders = await order.findAll({
            include: [{association: 'user', attributes: {exclude: ['password', 'status', 'fcm']}}, {
                association: 'machines', through: {attributes: ['quantity', 'contractStartDate', 'contractEndDate']}
            },], order: [[sequelize.literal('createdAt'), 'DESC']],
            where: {
                [Op.and]: [
                    sequelize.where(sequelize.fn('date', sequelize.col('orderDate')), '>=', req.body.startDate),
                    sequelize.where(sequelize.fn('date', sequelize.col('orderDate')), '<=', req.body.endDate),
                ]
            },
        })


        res.status(200).send({status: true, data: {orders: orders}});


    } catch (err) {
        console.log(err.message)
        res.status(200).send({status: false, data: "Failed to retrieve data"});
    }
};
exports.getRepairsByDate = async (req, res) => {
    try {


        const repairs = await repair.findAll({
            include: [{
                association: 'order', include: [

                    {
                        association: 'user', attributes: {exclude: ['password', 'status', 'fcm']}
                    },]


            }, {
                association: 'machine', attributes: {
                    include: [[sequelize.literal(`(select contractStartDate from ordermachines where machineId = repair.machineId AND orderId = repair.orderId)`), 'contractStartDate'

                    ], [sequelize.literal(`(select contractEndDate from ordermachines where machineId = repair.machineId AND orderId = repair.orderId)`), 'contractEndDate'

                    ]]
                }
            }], order: [[sequelize.literal('createdAt'), 'DESC']],
            where: {
                [Op.and]: [
                    sequelize.where(sequelize.fn('date', sequelize.col('repair.createdAt')), '>=', req.body.startDate),
                    sequelize.where(sequelize.fn('date', sequelize.col('repair.createdAt')), '<=', req.body.endDate),
                ]
                //
                // createdAt: {
                //     [Op.and]: {
                //         [Op.gte]: req.body.startDate,
                //         [Op.lte]: req.body.endDate
                //     }
                // }
            },

        });

        res.status(200).send({status: true, data: {repairs: repairs}});


    } catch (err) {
        console.log(err.message)
        res.status(200).send({status: false, data: "Failed to retrieve data"});
    }
};
