const uuid = require('uuid');
const User = require("./user.model")

module.exports = class Cliente {
    constructor (data){
        var nuevoUser = new User({
            email:    data.email,
            nickname: data.nickname ? data.nickname : data.identificacion
        })
        if (data.password) nuevoUser.encryptPassword(data.password);

        this.cliente = {
            _id: uuid.v4(),
            nombre: data.nombre,
            apellido: data.apellido,
            provincia: data.provincia,
            ciudad: data.ciudad,
            dir: data.dir,
            identificacion: data.identificacion,
            usuario: nuevoUser.data,
            activo: true,
            admin_id: data.admin_id,
        }
    }
}