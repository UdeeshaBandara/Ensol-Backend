const UsersController = require('./controllers/users.controller');
const VerifyUserMiddleware = require('../middlewares/verify.user.middleware');
const ValidationMiddleware = require('../middlewares/auth.validation.middleware');
const config = require('../config/env.config');

const ADMIN = config.permissionLevels.ADMIN;
const PAID = config.permissionLevels.PAID_USER;
const FREE = config.permissionLevels.NORMAL_USER;

exports.routesConfig = function (app) {
    app.post('/users', [
        UsersController.insert
    ]);
    app.get('/users', [
        ValidationMiddleware.validJWTNeeded,
        UsersController.get
    ]);

    app.put('/users/:userId', [
        ValidationMiddleware.validJWTNeeded,
        VerifyUserMiddleware.isPasswordAndUserMatch,
        UsersController.patchById
    ]);

    app.post('/users/notification', [
        ValidationMiddleware.validJWTNeeded,
        UsersController.sendNotification
    ]);
};
