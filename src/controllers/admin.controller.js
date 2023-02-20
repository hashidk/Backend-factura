const { makeUCAdmins, makeUCEmpleados, makeUCBancos } = require("../use-cases")
const { getAdmin } = makeUCAdmins()
const { getEmpleado, createEmpleado} = makeUCEmpleados()
const { getBancos:getBancosUS, getBanco, getBancoByName, createBanco, updateBanco:updateBancoUS } = makeUCBancos()

const { generatePasswordRand } = require("../utils")
const {Empleado, Banco} = require("../models")
const fs = require('fs');

function adminsControllers() {
    async function getInfo(req, res) {
        const { nickname } = res.locals.user 
        try {
            var result = await getAdmin(nickname)
            return res.status(200).send(result)
        } catch (error) {
            return res.status(error.code).send(error.msg)
        }
    }
    
    async function addEmpleado(req, res) {
        const { nombre, apellido, identificacion, correo } = req.body
        if (!nombre || !apellido || !identificacion || !correo) {
            return res.status(400).send("No se enviaron los datos necesarios")
        }

        try {
            var empleado = await getEmpleado(identificacion);
            if (empleado) return res.status(400).send("El empleado ya existe")

            var password = generatePasswordRand(16)

            //Enviar correo
            const content = `Empleado: Su usuario es: ${identificacion} y su contraseña es: ${password}\n`;
            fs.writeFile('./test.txt', content, { flag: 'a+' }, err => console.error(err));

            var nuevoEmpleado = new Empleado({ nombre, apellido, identificacion, email: correo, password })

            await createEmpleado(nuevoEmpleado.empleado)

            return res.status(200).send("Se ha creado un nuevo empleado")
        } catch (error) {
            return res.status(error.code).send(error.msg)
        }
    }

    async function getBancos(req, res) {
        try {
            var result = await getBancosUS()
            return res.status(200).send(result)
        } catch (error) {
            return res.status(error.code).send(error.msg)
        }
    }

    async function addBanco(req, res) {
        const { id, nombre, usuario, password, dominio, prueba, transferir } = req.body
        if (!id || !nombre || !usuario || !password || !dominio || !prueba || !transferir ) {
            return res.status(400).send("No se enviaron los datos necesarios")
        }

        try {
            var bancoss = await getBanco(id);
            if (bancoss) return res.status(400).send("El banco externo ya existe con ese id")


            var nuevoBanco = new Banco({ id, nombre, usuario, password, dominio, prueba, transferir })

            await createBanco(nuevoBanco.bank)

            return res.status(200).send("Se ha creado un nuevo banco")
        } catch (error) {
            return res.status(error.code).send(error.msg)
        }   
    }

    async function updateBanco(req, res) {
        const { idBanco } = req.params;

        const { nombre, usuario, password, dominio, prueba, transferir } = req.body
        if (!nombre || !usuario || !password || !dominio || !prueba || !transferir ) {
            return res.status(400).send("No enviaron los datos necesarios")
        }
        try {
            var bancoss = await getBanco(parseInt(idBanco));
            if (!bancoss) return res.status(400).send("El banco no existe")
            
            var nuevoBanco = new Banco({ id: bancoss._id, nombre, usuario, password, dominio, prueba, transferir })


            await updateBancoUS(nuevoBanco.bank)
            return res.status(200).send("Banco actualizado");
        } catch (error) {
            return res.status(error.code).send(error.msg)
        }
    }

    return Object.freeze({
        getInfo, addEmpleado, getBancos, addBanco, updateBanco
    })
}

module.exports = adminsControllers