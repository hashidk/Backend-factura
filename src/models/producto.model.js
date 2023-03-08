const uuid = require('uuid');

module.exports = class Producto {
    constructor (data){
        this.prod = {
            _id: uuid.v4(),
            precio: data.precio,
            descripcion: data.descripcion,
            admin_id: data._id
        }
    }
}