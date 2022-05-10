const config = require('./config/env.config.js');

const db = require("./models/models.index");
const express = require('express');
const admin = require("firebase-admin")
const serverKey = require('./private_key.json');

admin.initializeApp({
    credential: admin.credential.cert(serverKey),
    storageBucket: config.bucket
});

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
app.locals.bucket = admin.storage().bucket();
db.sequelize.sync( );
// db.sequelize.sync({alter:true});
AuthorizationRouter.routesConfig(app);
UsersRouter.routesConfig(app);
MachineRouter.routesConfig(app);
RepairRouter.routesConfig(app);
OrderRouter.routesConfig(app);

// app.post('/uploadImage',upload.single('file'),async(req,res)=>{
//     // const name = saltedMd5(req.file.originalname, 'SUPER-S@LT!')
//     // const fileName = name + path.extname(req.file.originalname)
//      await app.locals.bucket.file(req.file.originalname).createWriteStream().end(req.file.buffer)
//
//     // const bucket = gcs.Bucket(app.locals.bucket);
//     const file = app.locals.bucket.file(req.file.originalname);
//     return file.getSignedUrl({
//         action: 'read',
//         expires: '03-09-2491'
//     }).then(signedUrls => {
//         // signedUrls[0] contains the file's public URL
//         res.send({'done':signedUrls[0],"other":signedUrls});
//     });
//
// })

app.listen(process.env.PORT || 3000, function () {
    console.log('app listening at port %s', config.port);
});
