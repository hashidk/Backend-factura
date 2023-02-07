const {makeUCClientes} = require("../use-cases")
const {showClientes} = makeUCClientes()
const {Cliente, User} = require("../models")

function clientesControllers() {
    async function getClientes(req, res) {
        try {
            var result = await showClientes()
            return res.status(200).send(result)
        } catch (error) {
            return res.status(400).send(error)
        }
    }

    function addCliente(req, res) {
        const {nombre, apellido, provincia, ciudad, codigo_postal, identificacion, correo, nickname} = req.body
        if (!nombre || !apellido || !provincia || !ciudad || !codigo_postal || !identificacion || !correo || !nickname) {
            return res.status(400).send("No enviaron los datos necesarios")
        }

        if (condition) {
            
        }

        var nuevoCliente = new Cliente({nombre, apellido, provincia, ciudad, codigo_postal, identificacion})
        nuevoCliente.setUsuario({email: correo, nickname})
        nuevoCliente.cliente.usuario
        console.log(nuevoCliente);
        console.log(nuevoCliente.cliente.usuario);

        return res.status(200).send("ok")
    }

    return Object.freeze({
        getClientes,
        addCliente
    })
}

module.exports = clientesControllers