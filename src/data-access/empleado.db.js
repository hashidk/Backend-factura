const Database = require("../Database")
const conn = Database.conn

function handleEmpleadoDb() {
    async function find(_filter, _options = {}) {
        return await conn.db.collection("Empleados").find(_filter).toArray();
    }

    async function findOne(_filter, _options = {}) {
        return await conn.db.collection("Empleados").findOne(_filter);
    }
    async function insertOne(nuevoEmpleado) {
        try {
            await conn.db.collection("Empleados").insertOne(nuevoEmpleado);
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

module.exports = handleEmpleadoDb