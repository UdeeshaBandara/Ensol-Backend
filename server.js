const config = require('./config/env.config.js');

const db = require("./models/models.index");
const express = require('express');
const app = express();

const AuthorizationRouter = require('./authorization/routes.config');
const UsersRouter = require('./users/routes.config');
const MachineRouter = require('./machines/machine.routes.config');
const RepairRouter = require('./repairs/repair.routes.config');
const OrderRouter = require('./orders/order.routes.config');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});

app.use(express.json());
db.sequelize.sync( );
// db.sequelize.sync({alter:true});
AuthorizationRouter.routesConfig(app);
UsersRouter.routesConfig(app);
MachineRouter.routesConfig(app);
RepairRouter.routesConfig(app);
OrderRouter.routesConfig(app);


app.listen(process.env.PORT || 3000, function () {
    console.log('app listening at port %s', config.port);
});
