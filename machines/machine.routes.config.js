const MachineController = require('./controller/machine.controller');
const VerifyUserMiddleware = require('../middlewares/verify.user.middleware');
const ValidationMiddleware = require('../middlewares/auth.validation.middleware');
const config = require('../config/env.config');
const multer=require('multer');
const upload=multer({storage: multer.memoryStorage()});


exports.routesConfig = function (app) {
    app.post('/machine', [
        ValidationMiddleware.validJWTNeeded,
        MachineController.insert
    ]);
    app.post('/machine/image', [
        ValidationMiddleware.validJWTNeeded,
        upload.single('file'),
        MachineController.uploadImage
    ]);
    app.get('/machine/:id', [
        ValidationMiddleware.validJWTNeeded,
        MachineController.get
    ]);
    app.get('/machine', [
        ValidationMiddleware.validJWTNeeded,
        MachineController.getAll
    ]);
    app.put('/machine/:id', [
        ValidationMiddleware.validJWTNeeded,
        MachineController.patchById
    ]);
    app.delete('/machine/:id', [
        ValidationMiddleware.validJWTNeeded,
        MachineController.disableById
    ]);
};
