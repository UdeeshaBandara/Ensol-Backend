const config = require('./config/env.config.js');

const db = require("./models/index.models");
const express = require('express');
const admin = require("firebase-admin");
const serverKey = require('./private_key.json');
const expressValidator = require('express-validator');

admin.initializeApp({
    credential: admin.credential.cert(serverKey),
    storageBucket: config.bucket
});

const app = express();

const AuthorizationRouter = require('./authorization/auth.routes.config');
const UsersRouter = require('./users/user.routes.config');
const MachineRouter = require('./machines/machine.routes.config');
const RepairRouter = require('./repairs/repair.routes.config');
const OrderRouter = require('./orders/order.routes.config');
const AdminRouter = require('./admin/admin.routes.config');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});

app.use(express.json());
// app.use(expressValidator);
app.locals.bucket = admin.storage().bucket();
// db.sequelize.sync( );
// db.sequelize.sync({alter:true});
AuthorizationRouter.routesConfig(app);
UsersRouter.routesConfig(app);
MachineRouter.routesConfig(app);
RepairRouter.routesConfig(app);
OrderRouter.routesConfig(app);
AdminRouter.routesConfig(app);



app.listen(process.env.PORT || 3000, function () {
    console.log('app listening at port %s', config.port);
});
