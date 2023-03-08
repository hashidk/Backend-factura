const handleCollectionDB = require("../data-access")
const facturasDB = handleCollectionDB("Facturas");

module.exports = function makeUCFacturas() {
    async function getFactura( _id ) {
        try {
            return await facturasDB.findOne({ _id });
        } catch (error) {
            throw error;
        }
    };

    async function getFacturas( ) {
        try {
            return await facturasDB.find({});
        } catch (error) {
            throw error;
        }
    };

    async function getFacturasByEmpresa(empresa) {
        try {
            return await facturasDB.find({empresa});
        } catch (error) {
            throw error;
        }
    };

    async function getFacturasByEmpresaAndCliente(empresa, cliente) {
        try {
            return await facturasDB.find({empresa, cliente});
        } catch (error) {
            throw error;
        }
    };

    async function getFacturasByEmpresaAndClienteAndId(empresa, cliente, _id) {
        try {
            return await facturasDB.findOne({empresa, cliente, _id});
        } catch (error) {
            throw error;
        }
    };

    async function getFacturaByEmpresaAndId(empresa, _id) {
        try {
            return await facturasDB.findOne({empresa, _id});
        } catch (error) {
            throw error;
        }
    };

    async function createFactura(factura) {
        try {
            await facturasDB.insertOne(factura);
            return null;    
        } catch (error) {
            throw error;   
        }
    }

    async function updateFactura(factura, updateItems=true) {
        try {
            const _id = factura._id
            delete factura._id
            if (!updateItems) {
                delete factura.items 
                delete factura.subtotal 
            }
            await facturasDB.updateOne({ _id }, {$set: factura});
            return null;    
        } catch (error) {
            throw error;   
        }
    }

    return Object.freeze({
        getFactura, getFacturas, createFactura, updateFactura, getFacturasByEmpresa, 
        getFacturasByEmpresaAndCliente, getFacturasByEmpresaAndClienteAndId, getFacturaByEmpresaAndId
    })
  }