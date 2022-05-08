const RepairController = require('./controller/repair.controller');
const ValidationMiddleware = require('../middlewares/auth.validation.middleware');


exports.routesConfig = function (app) {
    app.post('/repair', [
        ValidationMiddleware.validJWTNeeded,
        RepairController.insert
    ]);
    app.get('/repair/:id', [
        ValidationMiddleware.validJWTNeeded,
        RepairController.get
    ]);
    app.get('/repair', [
        ValidationMiddleware.validJWTNeeded,
        RepairController.getAll
    ]);
    app.put('/repair/:id', [
        ValidationMiddleware.validJWTNeeded,
        RepairController.patchById
    ]);
    app.delete('/repair/:id', [
        ValidationMiddleware.validJWTNeeded,
        RepairController.disableById
    ]);
};
