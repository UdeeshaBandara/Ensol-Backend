const UsersController = require('./controllers/users.controller');
const VerifyUserMiddleware = require('../middlewares/verify.user.middleware');
const ValidationMiddleware = require('../middlewares/auth.validation.middleware');
const config = require('../config/env.config');


exports.routesConfig = function (app) {
    app.post('/users', [
        VerifyUserMiddleware.checkEmailPhoneNumber,
        UsersController.insert
    ]);
    app.get('/user', [
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
