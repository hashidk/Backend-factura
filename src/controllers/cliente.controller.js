const {makeUCClientes, makeUCCuentas, makeUCBancos} = require("../use-cases")
const { getCliente } = makeUCClientes()
const { getCuentasByCliente, getCuentaByCliente, getCuentaById, 
    transferInternAsNonTransaction, getCuentasDiffById, updateCuenta,
    req_transferir_banco, testBanco} = makeUCCuentas();
const { getBanco } = makeUCBancos()

const {Cliente, User, TransferenciaInterna} = require("../models");

function clientesControllers() {
    async function getInfo(req, res) {
        const { nickname } = res.locals.user 

        try {
            var result = await getCliente(nickname)
            return res.status(200).send(result)
        } catch (error) {
            return res.status(error.code).send(error.msg)
        }
    }

    async function getCuentas(req, res) {
        const { nickname } = res.locals.user 
        try {
            var result = await getCuentasByCliente(nickname)
            return res.status(200).send(result)
        } catch (error) {
            return res.status(error.code).send(error.msg)
        }
    }

    async function getOtrasCuentas(req, res) {
        const { idCuenta } = req.params;
        try {
            var result = await getCuentasDiffById(idCuenta)
            return res.status(200).send(result)
        } catch (error) {
            return res.status(error.code).send(error.msg)
        }
    }
    
    async function getCuenta(req, res) {
        const { nickname } = res.locals.user 
        const { idCuenta } = req.params;
        try {
            var result = await getCuentaByCliente(nickname, idCuenta)
            if (!result) {
                return res.status(400).send("No posee esta cuenta o no es parte de ella")
            }else{
                return res.status(200).send(result)
            }
        } catch (error) {
            return res.status(error.code).send(error.msg)
        }
    }

    async function transferencia_interna(req, res) {
        const { idCuenta } = req.params;
        const { nickname } = res.locals.user 
        var { monto, cuentaDestino } = req.body
        if (!monto || !cuentaDestino) {
            return res.status(400).send("Enviar todos los datos necesarios")
        }

        if (idCuenta === cuentaDestino) {
            return res.status(400).send("No es posible transferir dinero a la misma cuenta")
        }
        monto = Math.round(parseFloat(monto)*100)/100

        if (monto <= 0) {
            return res.status(400).send("El monto debe ser un valor distinto de cero o negativo")
        }
        // return res.status(200).send(`transferencia realizada desde la cuenta: ${idCuenta}`)

        try {
            var cuenta = await getCuentaByCliente(nickname, idCuenta)
            if (!cuenta) {
                return res.status(400).send("No posee la cuenta de origen o no es parte de ella")
            }
            //Verificar si existen los fondos necesarios
            if (cuenta.monto < monto) {
                return res.status(400).send("No existen los fondos suficientes")
            }
            
            // Verificar si no excede al limite
            if (!TransferenciaInterna.verificarLimite(monto)) {
                return res.status(400).send("El limite excede al limite de transferencia")
            }
            
            //Verificar si existe la otra cuenta cuentas
            var cuenta2 = await getCuentaById(cuentaDestino)
            if (!cuenta2) {
                return res.status(400).send("La cuenta destino no existe")
            }

            //Realizar la transferencia
            await transferInternAsNonTransaction(cuenta._id, cuenta2._id, monto)
            
            return res.status(200).send("Transferencia realizada exitosamente")

        } catch (error) {
            return res.status(error.code).send(error.msg)
        }
    }

    async function transferencia_externa(req, res) {
        const { idCuenta } = req.params;
        const { nickname } = res.locals.user 
        var { monto, cuentaDestino, banco } = req.body
        if (!monto || !cuentaDestino || !banco) {
            return res.status(400).send("Enviar todos los datos necesarios")
        }

        monto = Math.round(parseFloat(monto)*100)/100
        // return res.status(200).send(`transferencia realizada desde la cuenta: ${idCuenta}`)

        try {
            var cuenta = await getCuentaByCliente(nickname, idCuenta)
            if (!cuenta) {
                return res.status(400).send("No posee la cuenta de origen o no es parte de ella")
            }
            //Verificar si existen los fondos necesarios
            if (cuenta.monto < monto) {
                return res.status(400).send("No existen los fondos suficientes")
            }
            
            // Verificar si no excede al limite
            if (!TransferenciaInterna.verificarLimite(monto)) {
                return res.status(400).send("El limite excede a al limite de transferencia")
            }
            
            // Verificar que exista ese banco dentro de la base de datos
            var bancoss = await getBanco(banco)
            if (!bancoss) return res.status(400).send("Ese banco no se encuentra registrado")

            //Verificar conexión con el banco
            await testBanco(bancoss.dominio+bancoss.prueba)

            //Realizar transacción
            await req_transferir_banco(
                bancoss.dominio+bancoss.transferir, 
                bancoss.usuario, 
                bancoss.password, 
                monto, 
                cuentaDestino
            )

            //Realizar la transferencia
            cuenta.monto = cuenta.monto - monto;
            await updateCuenta(cuenta)

            // await transferInternAsNonTransaction(cuenta._id, cuenta2._id, monto)
            
            return res.status(200).send("Transferencia realizada exitosamente")

        } catch (error) {
            if (!error.msg) {
                console.log(error);
                return res.status(400).send("Error al realizar la petición")
            }else{
                return res.status(error.code).send(error.msg)
            }
        }
    }

    async function receptar_externa(req, res) {
        var { monto, cuentaDestino } = req.body
        if (!monto || !cuentaDestino) {
            return res.status(400).send("Enviar todos los datos necesarios")
        }
        // return res.status(200).send(`transferencia realizada desde la cuenta: ${idCuenta}`)
        monto = Math.round(parseFloat(monto)*100)/100

        try {
           
            //Verificar si existe cuenta destino
            var cuenta2 = await getCuentaById(cuentaDestino)
            if (!cuenta2) {
                return res.status(400).send("La cuenta destino no existe")
            }

            //Realizar la transferencia
            cuenta2.monto = cuenta2.monto + monto;
            await updateCuenta(cuenta2)
            
            return res.status(200).send("Se ha añadido el monto")

        } catch (error) {
            return res.status(error.code).send(error.msg)
        }
    }

    return Object.freeze({
        getInfo, getCuentas, getCuenta, transferencia_interna, getOtrasCuentas,
        transferencia_externa, receptar_externa
    })
}

module.exports = clientesControllers