const makeUCClientes = require("./cliente")
const makeUCEmpleados = require("./empleado")
const makeAuthUsers = require("./auth")
const makeUCCuentas = require("./cuenta")
const makeUCAdmins = require("./admin")
const makeUCBancos = require("./banco")

module.exports = {
    makeAuthUsers,
    makeUCClientes,
    makeUCEmpleados,
    makeUCCuentas,
    makeUCAdmins,
    makeUCBancos
}