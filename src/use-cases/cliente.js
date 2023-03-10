const handleCollectionDB = require("../data-access");
const clienteDB = handleCollectionDB("Clientes")

module.exports = function makeUCClientes() {
    async function getMiCliente(nickname) {
        try {
            var cliente = await clienteDB.findOne({'usuario.nickname':nickname})
            return cliente;
        } catch (error) {
            throw error;
        }
    };

    async function getCliente(identificacion, admin_id) {
        try {
            var cliente = await clienteDB.findOne({identificacion, admin_id})
            return cliente;
        } catch (error) {
            throw error;
        }
    };

    async function getClientes(admin_id) {
        try {
            return await clienteDB.find({admin_id});
        } catch (error) {
            throw error;
        }
    };

    async function getClienteById(_id, admin_id) {
        try {
            return  await clienteDB.findOne({_id, admin_id});
        } catch (error) {
            throw error;
        }
    }

    async function createCliente(cliente) {
        try {
            await clienteDB.insertOne(cliente);
            return null;    
        } catch (error) {
            throw error;   
        }
    }

    async function changeActiveCliente(_id, activo) {
        try {
            if (activo) {
                await clienteDB.updateOne({_id}, {$set: {activo:false}})
            }else{
                await clienteDB.updateOne({_id}, {$set: {activo:true}})
            }
        } catch (error) {
            throw error; 
        }
    }

    async function updateCliente(cliente) {
        try {
            const _id = cliente._id
            delete cliente._id
            delete cliente.identificacion
            await clienteDB.updateOne({ _id }, {$set: cliente});
            return null;    
        } catch (error) {
            throw error;   
        }
    }

    return Object.freeze({
        getClientes,
        createCliente,
        getClienteById,
        getCliente,
        changeActiveCliente,
        updateCliente,
        getMiCliente
    })
  }