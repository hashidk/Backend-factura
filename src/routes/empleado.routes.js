var rutasEmpleado = require('express').Router();
const controllers = require("../controllers")

rutasEmpleado.get("/info", controllers.empleadoControllers().getInfo)

rutasEmpleado.get("/clientes", controllers.empleadoControllers().getClientes)
rutasEmpleado.post("/clientes", controllers.empleadoControllers().addCliente)
rutasEmpleado.put("/clientes/:idCliente", controllers.empleadoControllers().updateCliente)
rutasEmpleado.delete("/clientes/:idCliente", controllers.empleadoControllers().changeStatusCliente)

rutasEmpleado.get("/facturas", controllers.empleadoControllers().getFacturas)
rutasEmpleado.post("/facturas", controllers.empleadoControllers().addFactura)
rutasEmpleado.put("/facturas/:idFactura", controllers.empleadoControllers().updateFactura)
rutasEmpleado.get("/facturas/:idFactura", controllers.empleadoControllers().getFactura)

rutasEmpleado.get("/productos", controllers.empleadoControllers().getProductos)

module.exports = rutasEmpleado;
