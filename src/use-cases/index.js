const makeUCClientes = require("./cliente")
const makeUCEmpleados = require("./empleado")
const makeAuthUsers = require("./auth")

module.exports = {
    makeAuthUsers,
    makeUCClientes,
    makeUCEmpleados
}