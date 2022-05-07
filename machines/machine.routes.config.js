const MachineController = require('./controller/machine.controller');
const VerifyUserMiddleware = require('../middlewares/verify.user.middleware');
const ValidationMiddleware = require('../middlewares/auth.validation.middleware');
const config = require('../config/env.config');


exports.routesConfig = function (app) {
    app.post('/machine', [
        ValidationMiddleware.validJWTNeeded,
        MachineController.insert
    ]);
    app.get('/machine/:id', [
        ValidationMiddleware.validJWTNeeded,
        MachineController.get
    ]);
};
