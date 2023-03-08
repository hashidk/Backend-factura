var rutasCliente = require('express').Router();
const controllers = require("../controllers")

rutasCliente.get("/info", controllers.clientesControllers().getInfo )
rutasCliente.get("/facturas", controllers.clientesControllers().getFacturas)
rutasCliente.get("/facturas/:idFactura", controllers.clientesControllers().getFactura)

module.exports = rutasCliente;
