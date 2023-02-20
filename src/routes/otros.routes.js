const axios = require('axios');
require("dotenv").config()

/*
The key from one of your Verification Apps, found here https://dashboard.sinch.com/verification/apps
*/
const APPLICATION_KEY = "5d4b4f84-3a62-400d-a547-1a214de1b6b4";

/*
    The secret from the Verification App that uses the key above, found here https://dashboard.sinch.com/verification/apps
*/
const APPLICATION_SECRET = "oC1SpORWIEm+BfIc3icKUg==";

router.post("/rc", async function(req, res) {
    const gRecaptchaResponse = req.body['g-recaptcha-response']
    if (!gRecaptchaResponse) {
        res.status(200).send("fail")
    }
    const post_data = {
        secret:   '6Ld42DEkAAAAAIpJyVPEsXGvEnZbPZKO-v1YS3zF',
        response: gRecaptchaResponse
    }

    try {
        const resp = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${post_data.secret}&response=${post_data.response}`, {}, {
            headers: { "Content-Type": "application/x-www-form-urlencoded", 'json': true },
        })

        if (resp.data.success) {
            res.status(200).send("OK");
        }else{
            res.status(400).send("Falló la comprobación del recaptcha");
        }
    } catch (error) {
        res.status(400).send("Algo malo ocurrió");
    }
    
    // console.log(req.body);
    // res.status(200).send("ok")
})

router.post("/phone", async function(req, res) {
    // var data = getTextMessageInput(process.env.RECIPIENT_WAID, 'This is your code 94641');

    // try {
    //     var response = await sendMessage(data)
    //     res.sendStatus(201);
    //     return;
    // } catch (error) {
    //     // console.log(error);
    //     console.log(error.response.data);
    //     res.sendStatus(500);
    //     return;
    // }

    const TO_NUMBER = "+593995079657";

    const SINCH_URL = "https://verification.api.sinch.com/verification/v1/verifications";

    const basicAuthentication = APPLICATION_KEY + ":" + APPLICATION_SECRET;

    const payload = {
        identity: {
            type: 'number',
            endpoint: TO_NUMBER
        },
        method: 'sms'
    };

    const headers = {
        'Authorization': 'Basic ' + Buffer.from(basicAuthentication).toString('base64'),
        'Content-Type': 'application/json; charset=utf-8'
    };

    axios.post(SINCH_URL, payload, { headers })
        .then(response =>
            res.status(200).send(response.data)
        ).catch(error =>
            res.status(400).send('There was an error!' + error)
    );
    
})

router.post("/verifyphone", async function(req, res) {
    const {code} = req.body
    if (!code) {
        return res.status(400).send("No se puedo receptar el código")
    }
    /*
        The number that will receive the SMS. Test accounts are limited to verified numbers.
        The number must be in E.164 Format, e.g. Netherlands 0639111222 -> +31639111222
    */
    const TO_NUMBER = "+593995079657";

    /*
        The code which was sent to the number.
    */
    const CODE = code

    const SINCH_URL = "https://verification.api.sinch.com/verification/v1/verifications/number/" + TO_NUMBER;

    const basicAuthentication = APPLICATION_KEY + ":" + APPLICATION_SECRET;

    const payload = {
        method: 'sms',
        sms: {
            code: CODE
        }
    };

    const headers = {
        'Authorization': 'Basic ' + Buffer.from(basicAuthentication).toString('base64'),
        'Content-Type': 'application/json; charset=utf-8'
    };

    axios.put(SINCH_URL, payload, { headers })
        .then(response =>
            res.status(200).send(response.data)
        ).catch(error =>
            res.status(400).send('There was an error! '+ error)
    );
})

function sendMessage(data) {
    var config = {
      method: 'post',
      url: `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
      headers: {
        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: data
    };
  
    return axios(config)
  }

// function sendMessage(data) {
    
//     return axios.post(`https://graph.facebook.com/v15.0/115597018100112/messages`, data, {
//         headers: {
//             'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
//             'Content-Type': 'application/json'
//           },
//     })
// }

function getTextMessageInput(recipient, text) {
    // return JSON.stringify({
    //   "messaging_product": "whatsapp",
    //   "preview_url": false,
    //   "recipient_type": "individual",
    //   "to": '593995079657',
    //   "type": "text",
    //   "text": {
    //       "body": "dh"
    //   }
    // });



    return JSON.stringify(
        { 
            "messaging_product": "whatsapp", 
            "to": "593995079657", 
            "type": "template", 
            "template": { 
                "name": "hello_world", 
                "language": { "code": "en_US" } 
            } 
        }
    )
  }