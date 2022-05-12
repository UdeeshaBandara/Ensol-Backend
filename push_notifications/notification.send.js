const FCM = require('fcm-node');
const serverKey = require('../private_key.json');
const fcm = new FCM(serverKey);


exports.sendNotification = (fcmToken, title, content, res) => {

    const message = {
        to: fcmToken,

        notification: {
            title: title,
            body: content
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