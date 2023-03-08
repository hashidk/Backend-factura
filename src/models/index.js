const User = require("./user.model")
const Cliente = require("./cliente.model")
const Producto = require("./producto.model")
const Empleado = require("./empleado.model")
const Administrador = require("./admin.model")

const ErrorHTTP = require("./error.model")
const Email = require("./mail.model")
const Factura = require("./factura.model")

module.exports = {
    User, Cliente, Empleado, Producto, ErrorHTTP, Email, Factura, Administrador
}