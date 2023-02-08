const { makeUCEmpleados, makeUCClientes, makeUCCuentas } = require("../use-cases")
const { showInfo:showInfoEmpleados } = makeUCEmpleados()
const { showClientes, findClientePorId, crearCliente, findCliente } = makeUCClientes()
const { showInfo:showInfoCuentas, crearCuenta } = makeUCCuentas();

const { generatePasswordRand } = require("../utils")
const {Cliente, Cuenta} = require("../models")
const fs = require('fs');

function empleadosControllers() {
    async function getInfo(req, res) {
        const { nickname } = res.locals.user 
        try {
            var result = await showInfoEmpleados(nickname)
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

    async function getCuentas(req, res) {
        try {
            var result = await showInfoCuentas()
            return res.status(200).send(result)
        } catch (error) {
            return res.status(400).send(error)
        }
    }

    async function addCuenta(req, res) {
        var {tipo, clientes} = req.body
        if (!tipo || !clientes) {
            return res.status(400).send("No enviaron los datos necesarios")
        }
        tipo = (tipo === "corriente" || tipo === "C") ? "C" : "A"

        try {

            if (typeof clientes === 'string') {
                clientes = [clientes]
            }else if(Array.isArray(clientes)){
                clientes = [...new Set(clientes)] //Eliminar repetidos
            }else{
                return res.status(400).send("no ha proporcionado los datos correctos");
            }

            for (var i in clientes){
                var resp = await findCliente(clientes[i]);
                if (!resp) {
                    return res.status(400).send(`No existe el cliente con id: ${clientes[i]}`);
                }                
            }

            const nuevaCuenta = new Cuenta({tipo, clientes})
            var err = await crearCuenta(nuevaCuenta.cuenta)
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
        getInfo, getClientes, addCliente, getCuentas, addCuenta
    })
}

module.exports = empleadosControllers