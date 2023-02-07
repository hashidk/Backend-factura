const { makeUCEmpleados, makeUCClientes } = require("../use-cases")
const { showInfo } = makeUCEmpleados()
const { showClientes, findClientePorId, crearCliente } = makeUCClientes()
const { generatePasswordRand } = require("../utils")
const {Cliente} = require("../models")
const fs = require('fs');

function empleadosControllers() {
    async function getInfo(req, res) {
        try {
            var result = await showInfo()
            return res.status(200).send(result)
        } catch (error) {
            return res.status(400).send(error)
        }
    }

    async function getClientes(req, res) {
        try {
            var result = await showClientes()
            return res.status(200).send(result)
        } catch (error) {
            return res.status(400).send(error)
        }
    }

    async function addCliente(req, res) {
        const {nombre, apellido, provincia, ciudad, codigo_postal, identificacion, correo} = req.body
        if (!nombre || !apellido || !provincia || !ciudad || !codigo_postal || !identificacion || !correo) {
            return res.status(400).send("No enviaron los datos necesarios")
        }

        try {
            var cliente = await findClientePorId(identificacion);
            if (cliente) return res.status(400).send("Cliente ya existe")

            var password = generatePasswordRand(16)
            const content = `Su usuario es: ${identificacion} y su contraseña es: ${password}\n`;
            fs.writeFile('./test.txt', content, { flag: 'a+' }, err => console.error(err));
            var nuevoCliente = new Cliente({nombre, apellido, provincia, ciudad, codigo_postal, identificacion, email: correo, password})
    
            var err = await crearCliente(nuevoCliente.cliente)
            if(err) {
                return res.status(400).send(err)
            }

            return res.status(200).send("Creado nuevo cliente")
        } catch (error) {
            console.log(error);
            return res.status(400).send('Algo ocurrió')
        }

    }

    return Object.freeze({
        getInfo, getClientes, addCliente
    })
}

module.exports = empleadosControllers