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

    async function getAdminById(_id) {
        try {
            return await adminDB.findOne({_id});
        } catch (error) {
            throw error;
        }
    };

    async function createAdmin(admin) {
        try {
            await adminDB.insertOne(admin);
            return null;    
        } catch (error) {
            throw error;   
        }
    }

    return Object.freeze({
        getAdmin, createAdmin, getAdminById
    })
  }