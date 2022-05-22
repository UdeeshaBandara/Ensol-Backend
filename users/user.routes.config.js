const UsersController = require('./controllers/users.controller');
const VerifyUserMiddleware = require('../middlewares/verify.user.middleware');
const ValidationMiddleware = require('../middlewares/auth.validation.middleware');
const config = require('../config/env.config');


exports.routesConfig = function (app) {
    app.post('/user', [
        VerifyUserMiddleware.checkEmailPhoneNumber,
        UsersController.insert
    ]);
    app.get('/user', [
        ValidationMiddleware.validJWTNeeded,
        UsersController.get
    ]);
    app.post('/user/OTP', [
        UsersController.sendOTP
    ]);
    app.post('/user/resetPassword', [
        UsersController.resetPassword
    ]);


    app.put('/user/:userId', [
        ValidationMiddleware.validJWTNeeded,
        VerifyUserMiddleware.isPasswordAndUserMatch,
        UsersController.patchById
    ]);

    app.get('/user/notification', [
        ValidationMiddleware.validJWTNeeded,
        UsersController.getNotification
    ]);
};
