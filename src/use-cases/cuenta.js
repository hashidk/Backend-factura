const handleCollectionDB = require("../data-access")
const cuentaDB = handleCollectionDB("Cuentas");
const clienteDB = handleCollectionDB("Clientes");
const transferenciasIntDB = handleCollectionDB("TransferenciasInternas");
const {TransferenciaInterna} = require("../models")

module.exports = function makeUCCuentas() {
    async function showInfo(identificacion) {
        try {
            var cliente = await clienteDB.findOne({identificacion})
            var cuentas = await cuentaDB.find({ clientes: { $all: [ cliente._id ] } })
            return cuentas;
        } catch (error) {
            return null;
        }
    };

    async function showInfo(identificacion) {
        try {
            var cliente = await clienteDB.findOne({identificacion})
            var cuentas = await cuentaDB.find({ clientes: { $all: [ cliente._id ] } })
            return cuentas;
        } catch (error) {
            return null;
        }
    };

    async function verfyCuenta(idCuenta) {
        try {
            var cuenta = await cuentaDB.findOne({ _id: idCuenta })
            return cuenta;
        } catch (error) {
            return null;
        }
    };

    async function showInfoCuenta(identificacion, idCuenta) {
        try {
            var cliente = await clienteDB.findOne({identificacion})
            var cuenta = await cuentaDB.findOne({ _id: idCuenta, clientes: { $all: [ cliente._id ] } })
            return cuenta;
        } catch (error) {
            return null;
        }
    };

    async function crearCuenta(cuenta) {
        // var verify = User.validar({
        //     nickname: user.nickname,
        //     email: user.email,
        //     password: user.password
        // })
        // if(verify)
        //     return {
        //         error: "Error al validar los valores: " + verify,
        //         codigo: 400
        //     }
        
        var err = await cuentaDB.insertOne(cuenta);
        if (err) 
            return "Error al insertar los valores";

        return null
    }

    async function transfenciaInternaWithT(cuentaOrigen, cuentaDestino, monto) {
        
        var val = null
        try {
            const {options, session} = await cuentaDB.createSession()
            await session.withTransaction(async () => {
                var err = await cuentaDB.updateOne({ _id : cuentaOrigen  }, { $inc: { monto: -monto } }, { session });
                console.log(err);
                await cuentaDB.updateOne({ _id : cuentaDestino }, { $inc: { monto } }, { session });
                // await data.db.collection("logs").insertOne({date: new Date(), message: "User " + user_transfer_id + " has received " + money + "$ from " + idCuenta + "."})
            }, options);
        } catch (e) {
            val = e
        } finally {
            await session.endSession();
            return val
        }
    }

    async function transfenciaInternaWithoutT(cuentaOrigen, cuentaDestino, monto) {
        var err
        try {
            err = await cuentaDB.updateOne({ _id : cuentaOrigen  }, { $inc: { monto: -monto } });
            if (err) return err

            err = await cuentaDB.updateOne({ _id : cuentaDestino }, { $inc: { monto } });
            if (err) return err

            const ti = new TransferenciaInterna({monto,origen: cuentaOrigen,destino: cuentaDestino})
            err = await transferenciasIntDB.insertOne(ti.tranferInt)
            if (err) return err
                // await data.db.collection("logs").insertOne({date: new Date(), message: "User " + user_transfer_id + " has received " + money + "$ from " + idCuenta + "."})

            return null
        } catch (error) {
            return error
        }
    }


    return Object.freeze({
        showInfo, crearCuenta, showInfoCuenta, verfyCuenta, transfenciaInternaWithT,
        transfenciaInternaWithoutT
    })
  }