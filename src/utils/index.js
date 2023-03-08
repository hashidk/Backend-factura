const validators = require("./validar")
const crearFactura = require("./factura")

function generatePasswordRand(length) {
    var characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var pass = "";
    for (i=0; i < length; i++){
        pass += characters.charAt(Math.floor(Math.random()*characters.length));   
    }
    return pass;
}

module.exports = {
    generatePasswordRand,
    validators,
    crearFactura
}