
// const User = require("../models").User
const uuid = require('uuid');
const Database = require("../Database")
const conn = Database.conn

function handleUserDb() {
    async function find(_filter, _options = {}) {
        return await conn.db.collection("Usuario").find(_filter).toArray();
    }

    async function findOne(_filter, _options = {}) {
        return await conn.db.collection("Usuario").findOne(_filter);
    }
    async function insertOne(newUser) {
        _id = uuid.v4()
        try {
            await conn.db.collection("Usuario").insertOne({_id, ...newUser});
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

module.exports = handleUserDb