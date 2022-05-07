const multer  = require('multer')

exports.uploadImage = (request,response) => {

    console.log("request.file")
    const storagea = multer.diskStorage({
        destination: function (req, file, cb) {

            console.log("destination")
            cb(null, './uploads')
        },
        filename: function (req, file, cb) {
            console.log(file.originalname)
            cb(null, file.originalname)
        }
    })
    //
    const upload = multer({ storage: storagea })
     upload.single('udi').then(()=>{
         response.status(200).send({status: false,errors: "a"});

     });
    console.log("single")
   // return response.status(200).send({status: false,errors: "a"});
    // try {
    //     upload.single('udi'), function (req, res) {
    //         // req.file is the `avatar` file
    //         // req.body will hold the text fields, if there were any
    //         console.log("reached")
    //
    //         return response(res)
    //
    //     };
    // }catch (e) {
    //     response.status(200).send({status: false,errors: e.message});
    // }
    // response.status(200).send({status: false,errors: "err"});
};

