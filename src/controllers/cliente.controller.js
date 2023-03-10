const {makeUCClientes, makeUCFacturas, } = require("../use-cases")
const { getMiCliente } = makeUCClientes()
const { getFacturas:getFacturasUS,getFacturasByEmpresaAndCliente, getFacturasByEmpresaAndClienteAndId } = makeUCFacturas();
const fs = require("fs")
const path = require("path")
require("dotenv").config()

function clientesControllers() {
    async function getInfo(req, res) {
        const { nickname } = res.locals.user 

        try {
            var result = await getMiCliente(nickname)
            return res.status(200).send({data: result})
        } catch (error) {
            return res.status(error.code).send({message: error.msg})
        }
    }

    async function getFacturas(req, res) {
        const { nickname } = res.locals.user 
        try {
            var cliente = await getMiCliente(nickname)
            var result = await getFacturasByEmpresaAndCliente( cliente.admin_id, cliente._id)
            return res.status(200).send({data: result})
        } catch (error) {
            return res.status(error.code).send({message: error.msg})
        }
    }

    async function getFactura(req, res) {
        const { nickname } = res.locals.user 
        const { idFactura} = req.params;

        try {
            var cliente = await getMiCliente(nickname)
            var factura = await getFacturasByEmpresaAndClienteAndId( cliente.admin_id, cliente._id, idFactura)
            if (!factura) {return res.status(400).send({message: "Esa factura no le pertenece"})}
            var path_file = path.join(appPathRoot, 'facturas', factura.path);
            fs.exists(path_file, (exists) => {
                if (exists) {
                    return res.status(200).sendFile(path.resolve(path_file))
                }else {
                    return res.status(400).send({message: "No existe el pdf"})
                }
            })
        } catch (error) {
            return res.status(error.code).send({message: error.msg})
        }

    }

    return Object.freeze({
        getInfo, getFacturas, getFactura
    })
}

module.exports = clientesControllers