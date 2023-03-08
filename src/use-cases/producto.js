const handleCollectionDB = require("../data-access")
const productosDB = handleCollectionDB("Productos");

module.exports = function makeUCProductos() {
    async function getProducto( _id ) {
        try {
            return await productosDB.findOne({ _id });
        } catch (error) {
            throw error;
        }
    };

    async function getProductos() {
        try {
            return await productosDB.find({});
        } catch (error) {
            throw error;
        }
    };

    async function getProductosByAdmin(_id) {
        try {
            return await productosDB.find({admin_id: _id});
        } catch (error) {
            throw error;
        }
    };

    async function getProductosWithArray(id_productos) {
        try {
            return await productosDB.find({ _id: { $in:id_productos }});
        } catch (error) {
            throw error;
        }
    };

    async function createProducto(producto) {
        try {
            await productosDB.insertOne(producto);
            return null;    
        } catch (error) {
            throw error;   
        }
    }

    async function deleteProducto(_id) {
        try {
            await productosDB.deleteOne({ _id });
            return null;    
        } catch (error) {
            throw error;   
        }
    }

    async function updateProducto(producto) {
        try {
            const _id = producto._id
            delete producto._id
            await productosDB.updateOne({ _id }, {$set: producto});
            return null;    
        } catch (error) {
            throw error;   
        }
    }

    return Object.freeze({
        getProducto, getProductos, createProducto, updateProducto, deleteProducto, 
        getProductosWithArray, getProductosByAdmin
    })
  }