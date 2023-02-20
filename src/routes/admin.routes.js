var rutasAdmin = require('express').Router();
const controllers = require("../controllers")

rutasAdmin.get("/info", controllers.adminsControllers().getInfo)
rutasAdmin.post("/empleados", controllers.adminsControllers().addEmpleado)

rutasAdmin.get("/bancos", controllers.adminsControllers().getBancos)
rutasAdmin.post("/bancos", controllers.adminsControllers().addBanco)
rutasAdmin.put("/bancos/:idBanco", controllers.adminsControllers().updateBanco)


module.exports = rutasAdmin;