const { makeUCEmpleados, makeUCClientes, makeUCFacturas, makeUCProducto, makeUCAdmins } = require("../use-cases")
const { getMiEmpleado, getEmpleadoById } = makeUCEmpleados()
const { getClientes:getClientesUS, getCliente, createCliente, getClienteById, updateCliente:updateClienteUS, changeActiveCliente } = makeUCClientes()
const { createFactura, getFactura:getFacturaUS, getFacturasByEmpresa, getFacturas:getFacturasUS, 
    updateFactura:updateFacturaUS, getFacturaByEmpresaAndId } = makeUCFacturas();
const { getProducto, getProductos:getProductosUS, getProductosWithArray, getProductosByAdmin } = makeUCProducto();
const { getAdmin, getAdminById } = makeUCAdmins()

const { generatePasswordRand, validators } = require("../utils")
const { Cliente, Factura, Email } = require("../models")
const fs = require('fs');
const path = require("path");
var idfac = 1

function empleadosControllers() {
    async function getInfo(req, res) {
        const { nickname } = res.locals.user
        try {
            var empleado = await getMiEmpleado(nickname)
            var admin = await getAdminById(empleado.admin_id);

            var productos = await getProductosUS(admin._id)
            var clientes = await getClientesUS(admin._id)
            var facturas = await getFacturasByEmpresa(admin._id)
            return res.status(200).send({data: {...empleado,
                empresa_nombre: admin.empresa_nombre,
                empresa_dir: admin.empresa_dir,
                empresa_pais: admin.empresa_pais,
                empresa_ciudad: admin.empresa_ciudad,
                empresa_provincia: admin.empresa_provincia
            }, resumen: {
                productos: productos.length,
                clientes: clientes.length,
                facturas_espera: facturas.filter(ele => ele.estado===false).length,
                facturas_listo: facturas.filter(ele => ele.estado===true).length,
            }})
        } catch (error) {
            return res.status(error.code).send({message: error.msg})
        }
    }

    async function getClientes(req, res) {
        const { nickname } = res.locals.user
        try {
            var empleado = await getMiEmpleado(nickname);
            var result = await getClientesUS(empleado.admin_id)
            return res.status(200).send({data: result})
        } catch (error) {
            return res.status(error.code).send({message: error.msg})
        }
    }

    async function addCliente(req, res) {
        const { nickname } = res.locals.user
        const { nombre, apellido, provincia, ciudad, dir, identificacion, correo } = req.body
        if (!nombre || !apellido || !provincia || !ciudad || !dir || !identificacion || !correo) {
            return res.status(400).send({message: "No enviaron los datos necesarios"})
        }

        try {
            await validators.validString("nombre").anystring.validateAsync({value: nombre})
            await validators.validString("apellido").anystring.validateAsync({value: apellido})
            await validators.validString("provincia").anystring.validateAsync({value: provincia})
            await validators.validString("ciudad").anystring.validateAsync({value: ciudad})
            await validators.validString("dirección").anystring.validateAsync({value: dir})
            await validators.validString().identificacion.validateAsync({value: identificacion})
            await validators.validString().email.validateAsync({value: correo})
        } catch (error) {
            return res.status(400).send({message: error.message})
        }

        try {
            var empleado = await getMiEmpleado(nickname);
            var cliente = await getCliente(identificacion, empleado.admin_id);
            if (cliente) return res.status(400).send({message: "El cliente ya existe"})

            var password = generatePasswordRand(16)

            //Enviar correo
            var admin = await getAdminById(empleado.admin_id);
            const content = `Cliente: Su usuario es: ${admin._id.slice(0, 8)+identificacion} y su contraseña es: ${password}\n`;
            fs.writeFile('./test.txt', content, { flag: 'a+' }, err => console.error(err));
            new Email( correo, admin._id.slice(0, 8)+identificacion, password).sendmail()

            var nuevoCliente = new Cliente({ nombre, apellido, provincia, ciudad, dir, identificacion, email: correo, password, admin_id: admin._id, nickname: admin._id.slice(0, 8)+identificacion})

            await createCliente(nuevoCliente.cliente)

            return res.status(200).send({message: "Se ha creado un nuevo cliente"})
        } catch (error) {
            console.log(error);
            return res.status(error.code).send({message: error.msg})
        }
    }

    async function updateCliente(req, res) {
        const { idCliente } = req.params;
        const { nickname } = res.locals.user

        const { nombre, apellido, provincia, ciudad, dir, correo } = req.body
        if (!nombre || !apellido || !provincia || !ciudad || !dir || !correo) {
            return res.status(400).send({message: "No enviaron los datos necesarios"})
        }

        try {
            await validators.validString("nombre").anystring.validateAsync({value: nombre})
            await validators.validString("apellido").anystring.validateAsync({value: apellido})
            await validators.validString("provincia").anystring.validateAsync({value: provincia})
            await validators.validString("ciudad").anystring.validateAsync({value: ciudad})
            await validators.validString("dirección").anystring.validateAsync({value: dir})
            await validators.validString().email.validateAsync({value: correo})
        } catch (error) {
            return res.status(400).send({message: error.message})
        }

        try {
            var empleado = await getMiEmpleado(nickname);
            var cliente = await getClienteById(idCliente, empleado.admin_id);
            if (!cliente) return res.status(400).send({message: "El cliente no existe"})
            
            var clnt = new Cliente({ nombre, apellido, provincia, ciudad, dir, identificacion: "l", email: correo, admin_id:"l" })
            clnt.cliente.usuario.nickname = cliente.usuario.nickname
            clnt.cliente.usuario.password = cliente.usuario.password
            clnt.cliente.identificacion = cliente.identificacion
            clnt.cliente.usuario.salt = cliente.usuario.salt
            clnt.cliente.admin_id = cliente.admin_id
            clnt.cliente._id = cliente._id

            await updateClienteUS(clnt.cliente)
            return res.status(200).send({message: "Cliente actualizado"});
        } catch (error) {
            return res.status(error.code).send({message: error.msg})
        }
    }

    async function changeStatusCliente(req, res) {
        const { idCliente } = req.params;
        const { nickname } = res.locals.user

        try {
            var empleado = await getMiEmpleado(nickname);
            var cliente = await getClienteById(idCliente, empleado.admin_id);
            if (!cliente) return res.status(400).send({message: "El cliente no existe"})

            await changeActiveCliente(idCliente, cliente.activo)

            return res.status(200).send({message: `Cliente ${cliente.activo ? "desactivado" : "activado"}`});
        } catch (error) {
            return res.status(error.code).send({message: error.msg})
        }
    }

    async function getFacturas(req, res) {
        const { nickname } = res.locals.user
        try {
            var empleado = await getMiEmpleado(nickname);
            var admin = await getAdminById(empleado.admin_id);
            var result = await getFacturasByEmpresa(admin._id)
            return res.status(200).send({data: result})
        } catch (error) {
            return res.status(error.code).send({message: error.msg})
        }
    }

    async function addFactura(req, res) {
        const { nickname } = res.locals.user
        var { clienteid, productos, borrador } = req.body
        if (!clienteid || !productos) return res.status(400).send({message: "No se enviaron los datos necesarios"})
    
        if (typeof borrador != "boolean") {
            return res.status(400).send({message: 'Borrador debe ser un valor booleano'})
        }
        //Validar datos
        try {
            await validators.validString("cliente id").anystring.validateAsync({value: clienteid})
        } catch (error) {
            return res.status(400).send({message: error.message})
        }

        //tratamiento de Productos
        if (typeof productos === 'string') {
            productos = [productos]
        } else if (Array.isArray(productos)) {
            productos = [...new Set(productos)] //Eliminar repetidos
        } else {
            return res.status(400).send({message: "No ha proporcionado los datos correctos"});
        }
        try {
            var getProd = await getProductosWithArray(productos.map(ele => {return ele._id;}))
            if (getProd.length !== productos.length) {
                return res.status(400).send({message: "No se pudieron encontrar todos los productos"});
            }
            productos.forEach((_, index) => {
                getProd[index]['cantidad'] = productos[index].cantidad;
            });

            var empleado = await getMiEmpleado(nickname);
            delete empleado.usuario;
            var cliente = await getClienteById(clienteid, empleado.admin_id);
            if (!cliente) {return res.status(400).send({message: "No existe el cliente"});}
            delete cliente.usuario;
            var admin = await getAdminById(empleado.admin_id);
            delete admin.nombre; delete admin.apellido
            delete admin.identificacion; delete admin.usuario;

            const nuevaFactura = new Factura({ empresa:admin, cliente:cliente, vendedor:empleado, nfactura:idfac, items: getProd, borrador})
            idfac++;
            await createFactura(nuevaFactura.invoice)

            return res.status(200).send({message: "Se ha creado una nueva Factura"})
        } catch (error) {
            console.log(error);
            return res.status(error.code).send({message: error.msg})
        }
    }

    async function updateFactura(req, res) {
        const { idFactura } = req.params;
        var { productos, borrador } = req.body
        if (!productos) return res.status(400).send({message: "No se enviaron los datos necesarios"})
        if (typeof borrador != "boolean") {
            return res.status(400).send({message: 'Borrador debe ser un valor booleano'})
        }

        try {
            //tratamiento de Productos
            if (typeof productos === 'string') {
                productos = [productos]
            } else if (Array.isArray(productos)) {
                productos = [...new Set(productos)] //Eliminar repetidos
            } else {
                return res.status(400).send({message: "No ha proporcionado los datos correctos"});
            }

            if (productos.length > 0) {
                var getProd = await getProductosWithArray(productos.map(ele => {return ele._id;}))
                if (getProd.length !== productos.length) {
                    return res.status(400).send({message: "No se pudieron encontrar todos los productos"});
                }
                productos.forEach((_, index) => {
                    getProd[index]['cantidad'] = productos[index].cantidad;
                });
    
                var factura = await getFacturaUS(idFactura)
                if (!factura) {return res.status(400).send({message: "No existe la factura"});}
                var empleado = await getEmpleadoById(factura.vendedor, factura.empresa);
                delete empleado.usuario;
                var cliente = await getClienteById(factura.cliente, empleado.admin_id);
                if (!cliente) {return res.status(400).send({message: "No existe el cliente"});}
                delete cliente.usuario;
                var admin = await getAdminById(factura.empresa);
                delete admin.nombre; delete admin.apellido
                delete admin.identificacion; delete admin.usuario;
    
                const nuevaFactura = new Factura({ empresa:admin, cliente:cliente, vendedor:empleado, nfactura:factura.invoicer_nr, items: getProd, borrador, path: factura.path})
                nuevaFactura.invoice._id = factura._id;
                delete nuevaFactura.invoice.invoicer_nr, 
                delete nuevaFactura.invoice.empresa,
                await updateFacturaUS(nuevaFactura.invoice, true)
            }else{
                var factura = getFacturaUS(idFactura)
                if (factura.borrador === false) return res.status(400).send({message: "No se puede editar esta factura"});
                var empleado = await getEmpleadoById(factura.vendedor, factura.empresa);
                delete empleado.usuario;
                var cliente = await getClienteById(factura.cliente, empleado.admin_id);
                if (!cliente) {return res.status(400).send({message: "No existe el cliente"});}
                delete cliente.usuario;
                var admin = await getAdmin(factura.empresa);
                delete admin.nombre; delete admin.apellido
                delete admin.identificacion; delete admin.usuario;
    
                const nuevaFactura = new Factura({ empresa:admin, cliente:cliente, vendedor:empleado, nfactura:factura.invoicer_nr, items: [], path: factura.path, borrador})
                await updateFacturaUS(nuevaFactura.invoice, false)
            }
            return res.status(200).send({message: "Factura actualizada"});
        } catch (error) {
            console.log(error);
            return res.status(error.code).send({message: error.msg})
        }
    }

    async function getProductos(req, res) {
        const { nickname } = res.locals.user

        try {
            var empleado = await getMiEmpleado(nickname);
            var result = await getProductosByAdmin(empleado.admin_id)
            return res.status(200).send({data: result})
        } catch (error) {
            return res.status(error.code).send({message: error.msg})
        }
    }

    async function getFactura(req, res) {
        const { nickname } = res.locals.user
        const { idFactura } = req.params;
        try {
            var empleado = await getMiEmpleado(nickname);
            var factura = await getFacturaByEmpresaAndId(empleado.admin_id, idFactura)
            if (!factura) {return res.status(400).send({message: "Esa factura no le pertenece"})}
            var path_file = path.join(appPathRoot, 'facturas', factura.path);
            fs.exists(path_file, (exists) => {
                if (exists) {
                    return res.status(200).sendFile(path.resolve(path_file))
                }else {
                    return res.status(400).send({message: "No existe el pdf"})
                }
            })
        } catch (error) {
            return res.status(error.code).send({message: error.msg})
        }
    }

    return Object.freeze({
        getInfo, getClientes, addCliente, getFacturas, addFactura, updateCliente, changeStatusCliente, getFactura,
        updateFactura, getProductos
    })
}

module.exports = empleadosControllers