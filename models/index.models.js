const dbConfig = require("../config/env.config.js");
const  { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,

});

const db = {};

db.Sequelize = Sequelize;
db.DataTypes = DataTypes;
db.sequelize = sequelize;



db.user = require("./user.model.js")(sequelize, Sequelize,DataTypes);
db.machine = require("./machine.model.js")(sequelize, Sequelize,DataTypes);
db.repair = require("./repair.model.js")(sequelize, Sequelize,DataTypes);
db.order = require("./order.model.js")(sequelize, Sequelize,DataTypes);
db.notification = require("./notification.model.js")(sequelize, Sequelize,DataTypes);
db.orderMachines = require("./orderMachine.model.js")(sequelize, Sequelize,DataTypes);

//Table relationships
db.user.hasMany(db.order);
db.order.belongsTo(db.user);
db.user.hasMany(db.notification);
db.machine.hasMany(db.repair);
db.repair.belongsTo(db.machine);
db.order.hasMany(db.repair);
db.repair.belongsTo(db.order);
db.order.belongsToMany(db.machine,{through:db.orderMachines});

module.exports = db;