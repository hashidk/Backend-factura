const {handleEmpleadoDb} = require("../data-access")
const {find} = handleEmpleadoDb();

module.exports = function makeUCEmpleados() {
    async function showInfo() {
        try {
            var users = await find({})
            return users;
        } catch (error) {
            return null;
        }
    };

    return Object.freeze({
        showInfo
    })
  }