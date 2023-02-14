const database = require("./Database")

describe("Pruebas con la base de datos", () => {
    test("Conexión con la base de datos", () => {
        database.initConnection().then( () => {
            expect(database.conn.connection).not.toBe(null);
        }).catch(err => {
            expect(err).toBe(null);
        }).finally(()=>{
            database.conn.connection.close()
        })
    });

    test("Haciendo una consulta", async() => {
        database.initConnection().then( async() => {
            try {
                var users = await database.conn.db.collection( "Clientes" ).find({})
                expect(users).not.toBe(null);
            } catch (error) {
                expect(error).toBe(null);
            }
        }).catch(err => {
            console.log(err);
        }).finally(()=>{
            database.conn.connection.close()
        })
    });
})