
const {handleClientDb} = require("../data-access")
const {find, insertOne, findOne} = handleClientDb();

module.exports = function makeUCClientes() {
    async function showClientes() {
        try {
            var users = await find({})
            return users;
        } catch (error) {
            return null;
        }
    };

    async function findClientePorId(identificacion) {
        try {
            var cliente = await findOne({identificacion})
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
        
        var err = await insertOne(cliente);
        if (err) 
            return "Error al insertar los valores";

        return null
    }

    return Object.freeze({
        showClientes,
        findClientePorId,
        crearCliente
    })
  }