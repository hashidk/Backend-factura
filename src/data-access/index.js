const Database = require("../Database")
const conn = Database.conn

const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' }
  };

function handleCollectionDb(_collec) {
    async function find(_filter, _options = {}) {
        return await conn.db.collection( _collec ).find(_filter, _options).toArray();
    }

    async function findOne(_filter, _options = {}) {
        return await conn.db.collection( _collec ).findOne(_filter, _options);
    }

    async function insertOne(nuevo_cliente) {
        try {
            await conn.db.collection( _collec ).insertOne(nuevo_cliente);
            return null
        } catch (error) {
            return error
        }
    }

    async function updateOne(_filter, _update={}, _config={}) {
        try {
            await conn.db.collection( _collec ).updateOne(_filter, _update, _config);
            return null
        } catch (error) {
            return error
        }
    }

    async function createSession() {
        const session = conn.connection.startSession()
        return {session, options: transactionOptions};
    }

    return Object.freeze({
        find,
        findOne,
        insertOne,
        updateOne,
        createSession
      });

}

module.exports = handleCollectionDb