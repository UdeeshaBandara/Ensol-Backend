const VerifyUserMiddleware = require('../middlewares/verify.user.middleware');
const AuthValidationMiddleware = require('../middlewares/auth.validation.middleware');
const AdminController = require('./controllers/admin.controller');
const UploadController = require('../file_upload/upload.controller').uploadImage;

exports.routesConfig = function (app) {

    app.get('/admin/dashboardValues', [
        AuthValidationMiddleware.validJWTNeeded,
        AdminController.dashboardValues
    ]);



};