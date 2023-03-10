const { makeUCAdmins, makeUCEmpleados, makeUCProducto } = require("../use-cases")
const { getAdmin } = makeUCAdmins()
const { 
    getEmpleado, createEmpleado, getEmpleadoById, updateEmpleado:updateEmpleadoUS, 
    getEmpleados:getEmpleadosUS, changeActiveEmpleado
} = makeUCEmpleados()
const { 
    getProductos:getProductosUS, getProducto, createProducto, updateProducto:updateProductoUS, 
    deleteProducto:deleteProductoUS 
} = makeUCProducto()

const { generatePasswordRand, validators } = require("../utils")
const {Empleado, Producto, Email } = require("../models")
const fs = require('fs');

function adminsControllers() {
    async function getInfo(req, res) {
        const { nickname } = res.locals.user 
        try {
            var result = await getAdmin(nickname)
            return res.status(200).send({data: result})
        } catch (error) {
            return res.status(error.code).send({message: error.msg})
        }
    }

    async function getEmpleados(req, res) {
        const { nickname } = res.locals.user 
        try {
            var admin = await getAdmin(nickname)
            var result = await getEmpleadosUS(admin._id)
            return res.status(200).send({data: result})
        } catch (error) {
            return res.status(error.code).send({message: error.msg})
        }
    }
    
    async function addEmpleado(req, res) {
        const { nickname } = res.locals.user 
        const { nombre, apellido, identificacion, correo } = req.body
        if (!nombre || !apellido || !identificacion || !correo) {
            return res.status(400).send({message: "No se enviaron los datos necesarios"})
        }

        try {
            await validators.validString("nombre").anystring.validateAsync({value: nombre})
            await validators.validString("apellido").anystring.validateAsync({value: apellido})
            await validators.validString().identificacion.validateAsync({value: identificacion})
            await validators.validString().email.validateAsync({value: correo})
        } catch (error) {
            return res.status(400).send({message: error.message})
        }

        try {
            var admin = await getAdmin(nickname)
            var empleado = await getEmpleado(identificacion, admin._id);
            if (empleado) return res.status(400).send({message: "El empleado ya existe"})

            var password = generatePasswordRand(16)

            //Enviar correo
            const content = `Empleado: Su usuario es: ${admin._id.slice(0,8)+identificacion} y su contraseña es: ${password}\n`;
            fs.writeFile('./test.txt', content, { flag: 'a+' }, err => console.error(err));
            
            var nuevoEmpleado = new Empleado({ nombre, apellido, identificacion, email: correo, password, admin_id:admin._id, nickname:admin._id.slice(0,8)+identificacion })
            new Email(correo, admin._id.slice(0,8)+identificacion, password)

            await createEmpleado(nuevoEmpleado.empleado)

            return res.status(200).send({message: "Se ha creado un nuevo empleado"})
        } catch (error) {
            return res.status(error.code).send({message: error.msg})
        }
    }

    async function updateEmpleado(req, res) {
        const { nickname } = res.locals.user 
        const { idEmpleado } = req.params;
        const { nombre, apellido, correo } = req.body

        if (!nombre || !apellido || !correo) {
            return res.status(400).send({message: "No enviaron los datos necesarios"})
        }

        try {
            await validators.validString("nombre").anystring.validateAsync({value: nombre})
            await validators.validString("apellido").anystring.validateAsync({value: apellido})
            await validators.validString().email.validateAsync({value: correo})
        } catch (error) {
            return res.status(400).send({message: error.message})
        }

        try {
            var admin = await getAdmin(nickname)
            var empleado = await getEmpleadoById(idEmpleado, admin._id);
            if (!empleado) return res.status(400).send({message: "El empleado no existe"})
            
            var empl = new Empleado({ nombre, apellido, identificacion: "l", email: correo, admin_id:"l" })
            empl.empleado.usuario.password = empleado.usuario.password
            empl.empleado.usuario.nickname = empleado.usuario.nickname
            empl.empleado.identificacion = empleado.identificacion
            empl.empleado.usuario.salt = empleado.usuario.salt
            empl.empleado.admin_id = empleado.admin_id
            empl.empleado._id = empleado._id

            await updateEmpleadoUS(empl.empleado)
            return res.status(200).send({message: "Empleado actualizado"});
        } catch (error) {
            return res.status(error.code).send({message: error.msg})
        }
    }

    async function changeStatusEmpleado(req, res) {
        const { nickname } = res.locals.user 
        const { idEmpleado } = req.params;        
        try {
            var admin = await getAdmin(nickname)
            var empleado = await getEmpleadoById(idEmpleado, admin._id);
            if (!empleado) return res.status(400).send({message:"El empleado no existe"})

            await changeActiveEmpleado(idEmpleado, empleado.activo)

            return res.status(200).send({message:`Cuenta ${empleado.activo ? "desactivada" : "activada"}`});
        } catch (error) {
            return res.status(error.code).send({message:error.msg})
        }
    }

    async function getProductos(req, res) {
        const { nickname } = res.locals.user 
        try {
            var admin = await getAdmin(nickname)
            var result = await getProductosUS(admin._id)
            return res.status(200).send({data: result})
        } catch (error) {
            return res.status(error.code).send({message: error.msg})
        }
    }

    async function deleteProducto(req, res) {
        const { idProducto } = req.params;
        try {
            await deleteProductoUS(idProducto)
            return res.status(200).send({message: "Producto eliminado"})
        } catch (error) {
            return res.status(error.code).send({message: error.msg})
        }
    }

    async function addProducto(req, res) {
        const { descripcion, precio } = req.body
        if (!descripcion || !precio) {
            return res.status(400).send({message: "No se enviaron los datos necesarios"})
        }

        try {
            await validators.validString("descripcion").anystring.validateAsync({value: descripcion})
            await validators.validNumber().monto.validateAsync({value: precio})
        } catch (error) {
            return res.status(400).send({message: error.message})
        }

        const { nickname } = res.locals.user 
        try {
            var admin = await getAdmin(nickname)
            var nuevoproducto = new Producto({ descripcion, precio, _id: admin._id })
            await createProducto(nuevoproducto.prod)
            return res.status(200).send({message: "Se ha creado un nuevo Producto"})
        } catch (error) {
            return res.status(error.code).send({message: error.msg})
        }   
    }

    async function updateProducto(req, res) {
        const { nickname } = res.locals.user 
        const { idProducto } = req.params;
        const { descripcion, precio } = req.body
        if (!descripcion || !precio) {
            return res.status(400).send({message: "No se enviaron los datos necesarios"})
        }

        try {
            await validators.validString("descripcion").anystring.validateAsync({value: descripcion})
            await validators.validNumber().monto.validateAsync({value: precio})
        } catch (error) {
            return res.status(400).send({message: error.message})
        }

        try {
            var admin = await getAdmin(nickname)
            var producto = await getProducto(idProducto, admin._id);
            if (!producto) return res.status(400).send({message: "El producto no existe"})
            
            var nuevoproducto = new Producto({ descripcion, precio, _id: admin._id})
            await updateProductoUS(nuevoproducto.prod)
            return res.status(200).send({message: "Producto actualizado"});
        } catch (error) {
            return res.status(error.code).send({message: error.msg})
        }
    }

    return Object.freeze({
        getInfo, addEmpleado, updateEmpleado, getProductos, addProducto, updateProducto, 
        getEmpleados, deleteProducto, changeStatusEmpleado
    })
}

module.exports = adminsControllers