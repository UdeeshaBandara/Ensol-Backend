const VerifyUserMiddleware = require('../middlewares/verify.user.middleware');
const AuthValidationMiddleware = require('../middlewares/auth.validation.middleware');
const AuthorizationController = require('./controllers/authorization.controller');
const UploadController = require('../file_upload/upload.controller').uploadImage;
const multer  = require('multer')

const express = require('express');

exports.routesConfig = function (app) {

    app.get('/auth/revokeFCM', [
        AuthValidationMiddleware.validJWTNeeded,
        AuthorizationController.revokeFCM
    ]);

    app.get('/', [

        AuthorizationController.welcome
    ]);
    app.post('/auth', [
        VerifyUserMiddleware.hasAuthValidFields,
        VerifyUserMiddleware.isPasswordAndUserMatch,
        AuthorizationController.login
    ]);

    app.post('/auth/refresh', [
        AuthValidationMiddleware.validJWTNeeded,
        AuthValidationMiddleware.verifyRefreshBodyField,
        AuthValidationMiddleware.validRefreshNeeded,
        AuthorizationController.login
    ]);

};