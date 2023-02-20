const handleCollectionDB = require("../data-access")
const empleadoDB = handleCollectionDB("Empleados");

module.exports = function makeUCEmpleados() {
    async function getEmpleado(identificacion) {
        try {
            return await empleadoDB.findOne({identificacion});
        } catch (error) {
            throw error;
        }
    };

    async function createEmpleado(cliente) {
        try {
            await empleadoDB.insertOne(cliente);
            return null;    
        } catch (error) {
            throw error;   
        }
    }

    return Object.freeze({
        getEmpleado, createEmpleado
    })
  }