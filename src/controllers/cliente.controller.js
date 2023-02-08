const {makeUCClientes, makeUCCuentas} = require("../use-cases")
const {showClientes, showInf} = makeUCClientes()
const { showInfo:showInfoCuentas, showInfoCuenta, verfyCuenta, transfenciaInternaWithoutT } = makeUCCuentas();

const {Cliente, User, TransferenciaInterna} = require("../models")

function clientesControllers() {
    async function getInfo(req, res) {
        const { nickname } = res.locals.user 

        try {
            var result = await showInfo(nickname)
            return res.status(200).send(result)
        } catch (error) {
            return res.status(400).send(error)
        }
    }

    async function getCuentas(req, res) {
        const { nickname } = res.locals.user 
        try {
            var result = await showInfoCuentas(nickname)
            return res.status(200).send(result)
        } catch (error) {
            return res.status(400).send(error)
        }
    }

    async function getCuenta(req, res) {
        const { nickname } = res.locals.user 
        const { idCuenta } = req.params;
        try {
            var result = await showInfoCuenta(nickname, idCuenta)
            return res.status(200).send(result)
        } catch (error) {
            return res.status(400).send(error)
        }
    }

    async function transferencia_interna(req, res) {
        const { idCuenta } = req.params;
        const { nickname } = res.locals.user 
        const { monto, cuentaDestino } = req.body
        // return res.status(200).send(`transferencia realizada desde la cuenta: ${idCuenta}`)

        try {
            var cuenta = await showInfoCuenta(nickname, idCuenta)
            if (!cuenta) {
                return res.status(400).send("No cuenta con esta cuenta o no es parte de ella")
            }
            //Verificar si existen los fondos necesarios
            if (cuenta.monto < monto) {
                return res.status(400).send("No existen los fondos suficientes")
            }
            
            // Verificar si no excede al limite
            if (!TransferenciaInterna.verificarLimite(monto)) {
                return res.status(400).send("El limite excede a al limite de transferencia")
            }
            
            //Verificar si existe la otra cuenta cuentas
            var cuenta2 = await verfyCuenta(cuentaDestino)
            console.log(cuenta2);
            if (!cuenta2) {
                return res.status(400).send("La cuenta destino no existe")
            }

            //Realizar la transferencia
            var err = await transfenciaInternaWithoutT(cuenta._id, cuenta2._id, monto)
            if (err) {
                return res.status(400).send(err)
            }
            
            return res.status(200).send("ok")

        } catch (error) {
            return res.status(400).send(error)
        }

        // const query = {
        //     $or: [{
        //         id: idCuenta,
        //         money: {
        //             $gte: money
        //         }
        //     },{
        //         id: cliente_destino
        //     }
        //     ]
        // }

        // data.db.collection("Clientes").find(query).toArray().then( async resp => {
        //     if (resp.length == 2) {

        //         const session = data.client.startSession();
        //         try {
        //             await session.withTransaction(async () => {
        //                 await data.db.collection("Clientes").updateOne({ id : idCuenta }, { $inc: { money: -money } }, { session });
        //                 await data.db.collection("Clientes").updateOne({ id : cliente_destino }, { $inc: { money } }, { session });
        //                 await data.db.collection("logs").insertOne({date: new Date(), message: "User " + user_transfer_id + " has received " + money + "$ from " + idCuenta + "."})
        //             }, transactionOptions);
        //         } catch (e) {
        //             console.log(e);
        //             res.status(400).send("Fail")
        //         } finally {
        //             await session.endSession();
        //         }

        //         res.status(200).send("OK")
        //     }else {
        //         res.status(400).send("Fail")
        //     }
        // }).catch(err => {
        //     console.log(err)
        //     res.status(400).send("Fail")
        // })
    }

    return Object.freeze({
        getInfo, getCuentas, getCuenta, transferencia_interna
    })
}

module.exports = clientesControllers