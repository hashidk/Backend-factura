const uuid = require('uuid');

class Cuenta {
    constructor (data){
        this.cuenta = {
            _id: uuid.v4(),
            monto: 0,
            moneda: "USD",
            tipo: data.tipo,
            clientes: data.clientes
        }
    }
}

module.exports = Cuenta