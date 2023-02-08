const handleCollectionDB = require("../data-access")
const hEmpleadoDB = handleCollectionDB("Empleados");

module.exports = function makeUCEmpleados() {
    async function showInfo(identificacion) {
        try {
            var users = await hEmpleadoDB.find({identificacion})
            return users;
        } catch (error) {
            return null;
        }
    };

    return Object.freeze({
        showInfo
    })
  }