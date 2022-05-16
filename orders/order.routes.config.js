const OrderController = require('./controller/order.controller');
const ValidationMiddleware = require('../middlewares/auth.validation.middleware');



exports.routesConfig = function (app) {
    app.post('/order', [
        ValidationMiddleware.validJWTNeeded,
        OrderController.insert
    ]);

    app.get('/order/past', [
        ValidationMiddleware.validJWTNeeded,
        OrderController.getPastOrdersByUserId
    ]);
    app.get('/order/current', [
        ValidationMiddleware.validJWTNeeded,
        OrderController.getCurrentOrdersByUserId
    ]);
    app.get('/order/:id', [
        ValidationMiddleware.validJWTNeeded,
        OrderController.get
    ]);
    app.get('/order', [
        ValidationMiddleware.validJWTNeeded,
        OrderController.getAll
    ]);

    app.put('/order/:id', [
        ValidationMiddleware.validJWTNeeded,
        OrderController.patchById
    ]);
    app.delete('/order/:id', [
        ValidationMiddleware.validJWTNeeded,
        OrderController.disableById
    ]);
};
