const handleCollectionDB = require("../data-access")
const adminDB = handleCollectionDB("Admins");

module.exports = function makeUCAdmins() {
    async function getAdmin(identificacion) {
        try {
            return await adminDB.findOne({identificacion});
        } catch (error) {
            throw error;
        }
    };

    return Object.freeze({
        getAdmin
    })
  }