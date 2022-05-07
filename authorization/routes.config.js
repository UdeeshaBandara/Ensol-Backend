const VerifyUserMiddleware = require('../middlewares/verify.user.middleware');
const AuthValidationMiddleware = require('../middlewares/auth.validation.middleware');
const AuthorizationController = require('./controllers/authorization.controller');
const UploadController = require('../file_upload/upload.controller').uploadImage;
const multer  = require('multer')

const express = require('express');

exports.routesConfig = function (app) {

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
    app.use(express.static(__dirname + '/public'));
    app.use('/uploads', express.static('uploads'));

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {

            // console.log("destination")
            cb(null, './uploads')
        },
        filename: function (req, file, cb) {
            // console.log("filename")
            cb(null, file.originalname)
        }
    })
    //
    const upload = multer({ storage: storage })
    // app.post('/image', upload.single('udi'), function (req, res) {
    //     // req.file is the `avatar` file
    //     // req.body will hold the text fields, if there were any
    //     console.log("reached")
    //
    //
    //
    // });
    app.post('/image',[UploadController]);
    // app.post('/image',[UploadController]);
};