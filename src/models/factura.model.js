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
        })


        this.invoice = {
            _id: id,
            empresa: data.empresa._id,
            cliente: data.cliente._id,
            vendedor: data.vendedor._id,
            invoicer_nr: data.nfactura,
            subtotal: subtotal,
            productos: data.items.map(element => {return [element._id, element.cantidad]}),
            fecha: new Date(),
            path: path
        }

    }
    
    //Crear factura y retornar la dirección
    crearPDF(invoice){
        console.log(invoice);
        var _path_local = invoice.cliente.apellido + invoice.cliente.nombre + "_" + invoice.fecha.toLocaleDateString().split("/").join("-")+Math.floor(Math.random()*1000)+ '_factura.pdf';
        crearFactura(invoice, path.join(appPathRoot, 'facturas', _path_local))
        return _path_local;
    }
}