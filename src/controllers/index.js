const clientesControllers = require("./cliente.controller")
const authControllers = require("./auth.controller")
const empleadoControllers = require("./empleado.controller")
const adminsControllers = require("./admin.controller")


module.exports = {
    authControllers,
    clientesControllers,
    empleadoControllers,
    adminsControllers
}