const FCM = require('fcm-node')
const user = require("../models/models.index").user;

const serverKey = require('../private_key.json') //put the generated private key path here

const fcm = new FCM(serverKey)


exports.sendNotification
    = (title, res) => {

    const message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: 'fAbPA3t1TN2QzAeztvAeZw:APA91bEPFFl0vR1MWLUuwRrYWbSXvh8zJrPVAOSfd-Uf4-EJZhHnQqZOJbCUy4TxAPXRe6sLHld6EF_XdpWHuwWAdlp4-tWLpoOnf0_KfoyakUWQ4loDenAJTbcl-yJLcT8qMy1hTckN',


        notification: {
            title: title,
            body: 'Motor not working'
        }
        // ,
        //
        // data: {  //you can send only notification or only data(or include both)
        //     my_key: 'my value',
        //     my_another_key: 'my another value'
        // }
    }

    fcm.send(message, function (err, response) {
        if (err) {
            console.log(err)
        } else {
            return res(response)
            // console.log("Successfully sent with response: ", response)
        }
    })
};