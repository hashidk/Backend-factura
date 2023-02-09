const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config()
// const uri = process.env.URI_MONGODB;
const uri = "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const Logger = require("./Logger").Logger

var conn = {
    connection: null,
    db: null
}

async function initConnection(){
    try {
        Logger.logInfo("Abriendo la conexión a MongoDB...")
        conn.connection = await client.connect()
        conn.db         = conn.connection.db("Banco")
    } catch (error) {
        Logger.logErr(error);
        closeConnection()
    }
}

function closeConnection() {
    Logger.logInfo("Cerrando la conexión a MongoDB...")
    client.close();
}

module.exports = {
    initConnection,
    conn,
    closeConnection
}