const makeUCClientes = require("./cliente")
const makeUCEmpleados = require("./empleado")
const makeAuthUsers = require("./auth")
const makeUCProducto = require("./producto")
const makeUCAdmins = require("./admin")
const makeUCFacturas = require("./factura")

module.exports = {
    makeAuthUsers,
    makeUCClientes,
    makeUCEmpleados,
    makeUCProducto,
    makeUCAdmins,
    makeUCFacturas
}