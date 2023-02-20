const uuid = require('uuid');
const User = require("./user.model")

module.exports = class Cliente {
    constructor (data){
        var nuevoUser = new User({
            email:    data.email,
            nickname: data.identificacion
        })
        if (data.password) nuevoUser.encryptPassword(data.password);

        this.cliente = {
            _id: uuid.v4(),
            nombre: data.nombre,
            apellido: data.apellido,
            provincia: data.provincia,
            ciudad: data.ciudad,
            codigo_postal: data.codigo_postal,
            identificacion: data.identificacion,
            usuario: nuevoUser.data,
            activo: true,
        }
    }
}