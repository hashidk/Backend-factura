const User = require("./user.model")
const Cliente = require("./cliente.model")
const Cuenta = require("./cuenta.model")
const Empleado = require("./empleado.model")
const TransferenciaInterna = require("./transf_interna.model")
const ErrorHTTP = require("./error.model")
const Email = require("./mail.model")
const Banco = require("./banco.model")

module.exports = {
    User, Cliente, Empleado, Cuenta, TransferenciaInterna, ErrorHTTP, Email, Banco
}