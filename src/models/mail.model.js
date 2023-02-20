const nodemailer = require('nodemailer');
const validator = require("node-email-validation");

const { Logger } = require('../Logger');
require("dotenv").config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_NODEMAILER,
      pass: process.env.PASS_NODEMAILER
    }
});

class Mail {
    constructor(email, username, password){
        this.mailOptions = {
            from: process.env.FROM_NODEMAILER,
            to: email,
            subject: 'Envío de datos',
            text: `Buen día, para ingresar al sistema, use las siguientes credenciales: \nusername: ${username}\ncontraseña:${password}`
        };
    }

    sendmail(){
        transporter.sendMail(this.mailOptions, function(error, info){
            if (error) {
                Logger.logErr(error);
            } else {
                Logger.logDebug('Correo enviado: ' + info.response);
            }
        });
    }

    static verifyEmail(email){
        return validator.is_email_valid(email)
    }
}

module.exports = Mail