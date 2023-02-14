const {makeUCClientes, makeUCCuentas} = require("../use-cases")
const {showClientes, showInfo} = makeUCClientes()
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
            if (!result) {
                return res.status(400).send("No posee esta cuenta o no es parte de ella")
            }else{
                return res.status(200).send(result)
            }
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
    }

    return Object.freeze({
        getInfo, getCuentas, getCuenta, transferencia_interna
    })
}

module.exports = clientesControllers