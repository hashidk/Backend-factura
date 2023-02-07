const Database = require("../Database")
const conn = Database.conn

function handleClientDb() {
    async function find(_filter, _options = {}) {
        return await conn.db.collection("Clientes").find(_filter).toArray();
    }

    async function findOne(_filter, _options = {}) {
        return await conn.db.collection("Clientes").findOne(_filter);
    }
    async function insertOne(nuevoCliente) {
        try {
            await conn.db.collection("Clientes").insertOne(nuevoCliente);
            return null
        } catch (error) {
            return error
        }
    }

    return Object.freeze({
        find,
        findOne,
        insertOne
      });

}

module.exports = handleClientDb