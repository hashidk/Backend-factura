const uuid = require('uuid');
const { crearFactura } = require('../utils');
const path = require("path")
module.exports = class Factura {
    constructor (data){
        var subtotal = 0;
        var id = uuid.v4()

        data.items.forEach(element => {
            subtotal += element.cantidad*element.precio
        });
        var path = this.crearPDF({
            empresa: data.empresa,
            cliente: data.cliente,
            vendedor: data.vendedor,
            invoicer_nr: id,
            subtotal: subtotal,
            productos: data.items,
            fecha: new Date(),
        }, data.path)


        this.invoice = {
            _id: id,
            empresa: data.empresa._id,
            cliente: data.cliente._id,
            vendedor: data.vendedor._id,
            invoicer_nr: data.nfactura,
            subtotal: subtotal,
            productos: data.items.map(element => {return {_id: element._id, cantidad: element.cantidad}}),
            fecha: new Date(),
            path: path,
            borrador: data.borrador,
            estado: false
        }

    }
    
    //Crear factura y retornar la dirección
    crearPDF(invoice, anteriorPath){
        if (anteriorPath) {
            var _path_local = anteriorPath
        }else{
            var _path_local = invoice.cliente.apellido + invoice.cliente.nombre + "_" + invoice.fecha.toLocaleDateString().split("/").join("-")+"_"+invoice.fecha.toLocaleTimeString().split(":").join("-")+ '_factura.pdf';
        }
        crearFactura(invoice, path.join(appPathRoot, 'facturas', _path_local))
        return _path_local;
    }
}