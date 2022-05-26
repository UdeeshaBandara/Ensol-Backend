const MachineController = require('./controller/machine.controller');
const VerifyUserMiddleware = require('../middlewares/verify.user.middleware');
const ValidationMiddleware = require('../middlewares/auth.validation.middleware');
const RequestValidationMiddleware = require('../middlewares/request.validation.middleware');
const config = require('../config/env.config');
const multer=require('multer');
const upload=multer({storage: multer.memoryStorage()});


exports.routesConfig = function (app) {
    app.post('/machine', [
        ValidationMiddleware.validJWTNeeded,
        upload.array('machinePhotos',5),
        RequestValidationMiddleware.validate('machine'),
        MachineController.insert
    ]);
    app.get('/machine/home', [
        ValidationMiddleware.validJWTNeeded,
        MachineController.home
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
        upload.array('machinePhotos',5),
        RequestValidationMiddleware.validate('machineUpdate'),
        MachineController.patchById
    ]);
    app.delete('/machine/:id', [
        ValidationMiddleware.validJWTNeeded,
        MachineController.disableById
    ]);


};
