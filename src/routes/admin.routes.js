var rutasAdmin = require('express').Router();
const controllers = require("../controllers")

rutasAdmin.get("/info", controllers.adminsControllers().getInfo)
rutasAdmin.get("/empleados", controllers.adminsControllers().getEmpleados)
rutasAdmin.post("/empleados", controllers.adminsControllers().addEmpleado)
rutasAdmin.put("/empleados/:idEmpleado", controllers.adminsControllers().updateEmpleado)
rutasAdmin.delete("/empleados/:idEmpleado", controllers.adminsControllers().changeStatusEmpleado)

rutasAdmin.get("/productos", controllers.adminsControllers().getProductos)
rutasAdmin.post("/productos", controllers.adminsControllers().addProducto)
rutasAdmin.put("/productos/:idProducto", controllers.adminsControllers().updateProducto)
rutasAdmin.delete("/productos/:idProducto", controllers.adminsControllers().deleteProducto)


module.exports = rutasAdmin;