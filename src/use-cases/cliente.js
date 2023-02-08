const handleCollectionDB = require("../data-access")
const clienteDB = handleCollectionDB("Clientes")

module.exports = function makeUCClientes() {
    async function showInfo(identificacion) {
        try {
            var cliente = await clienteDB.findOne({identificacion})
            return cliente;
        } catch (error) {
            return null;
        }
    };

    async function showClientes() {
        try {
            var users = await clienteDB.find({})
            return users;
        } catch (error) {
            return null;
        }
    };

    async function findClientePorId(identificacion) {
        try {
            var cliente = await clienteDB.findOne({identificacion})
            return cliente;
        } catch (error) {
            return null;
        }
    }

    async function findCliente(_id) {
        try {
            var cliente = await clienteDB.findOne({_id})
            return cliente;
        } catch (error) {
            return null;
        }
    }

    async function crearCliente(cliente) {
        // var verify = User.validar({
        //     nickname: user.nickname,
        //     email: user.email,
        //     password: user.password
        // })
        // if(verify)
        //     return {
        //         error: "Error al validar los valores: " + verify,
        //         codigo: 400
        //     }
        
        var err = await clienteDB.insertOne(cliente);
        if (err) 
            return "Error al insertar los valores";

        return null
    }

    return Object.freeze({
        showClientes,
        findClientePorId,
        crearCliente,
        findCliente,
        showInfo
    })
  }