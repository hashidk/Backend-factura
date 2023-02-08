const makeUCClientes = require("./cliente")
const makeUCEmpleados = require("./empleado")
const makeAuthUsers = require("./auth")
const makeUCCuentas = require("./cuenta")

module.exports = {
    makeAuthUsers,
    makeUCClientes,
    makeUCEmpleados,
    makeUCCuentas
}