const handle = require("./index")
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config()

const uri = process.env.URI_MONGODB || "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const {find, findOne, insertOne, updateOne} = handle("Test")

describe("Probando...", function () {
    
    test("Creando un valor", async function () {
        client.connect().then(async resp => {
            try {
                var result = await resp.db("Banco").collection("Test").insertOne({name: "Will"})
                // await resp.db("Banco").collection("Test").updateOne()
                expect(result).not.toBe(null)
            } catch (error) {
                expect(error).toBe(null)
            }
        }).finally(() => {
            client.close()
        })
    })

    test("Buscando valores", async function () {
        client.connect().then(async resp => {
            try {
                var result = await resp.db("Banco").collection("Test").find({}, {name:1, _id:0}).toArray()
                expect(result).not.toBe(null)
                console.log(result);
            } catch (error) {
                expect(error).toBe(null)
            }
        }).finally(() => {
            client.close()
        })
    })
})
