const uuid = require('uuid');
const LIMITE = 2000

class TransferenciaInterna {

    constructor (data){
        this.tranferInt = {
            _id: uuid.v4(),
            moneda: "USD",
            monto: data.monto,
            cuenta_origen: data.origen,
            cuenta_destino: data.destino,
        }
    }

    static verificarLimite(monto){
        return (monto <= LIMITE);
    }

    static verificarDiffCuentas(idCuenta1, idCuenta2){
        return (idCuenta1 !== idCuenta2)
    }
}

module.exports = TransferenciaInterna