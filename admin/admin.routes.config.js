const VerifyUserMiddleware = require('../middlewares/verify.user.middleware');
const AuthValidationMiddleware = require('../middlewares/auth.validation.middleware');
const AdminController = require('./controllers/admin.controller');
const AuthorizationController = require("../authorization/controllers/authorization.controller");

exports.routesConfig = function (app) {

    app.post('/admin/auth', [
        VerifyUserMiddleware.hasAuthValidFields,
        VerifyUserMiddleware.isPasswordAndAdminMatch,
        AdminController.login
    ]);

    app.get('/admin/dashboardValues', [
        AuthValidationMiddleware.validJWTNeeded,
        AdminController.dashboardValues
    ]);
    app.post('/admin/order/filter', [
        AuthValidationMiddleware.validJWTNeeded,
        AdminController.getOrdersByDate
    ]);
    app.post('/admin/repair/filter', [
        AuthValidationMiddleware.validJWTNeeded,
        AdminController.getRepairsByDate
    ]);



};