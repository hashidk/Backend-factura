const uuid = require('uuid');
const User = require("./user.model")

module.exports = class Administrador {
    constructor (data){
        var nuevoUser = new User({
            email:    data.email,
            nickname: data.identificacion
        })
        if (data.password) nuevoUser.encryptPassword(data.password);

        this.admin = {
            _id: uuid.v4(),
            nombre: data.nombre,
            apellido: data.apellido,
            identificacion: data.identificacion,
            usuario: nuevoUser.data,
            empresa_nombre: data.empresa_nombre,
            empresa_dir: data.empresa_dir,
            empresa_ciudad: data.empresa_ciudad,
            empresa_provincia: data.empresa_provincia,
            empresa_pais: data.empresa_pais,
            firma: "3221792fc09b9ad1bbf8700dea712ada1e6eba9d9958a18c4c4ee2da8c8304442a9c5abd54b42eb963405beed2d95338ec185eee5aa52135e63ed8f568eb38a0",
            image: data.img,
        }
    }
}