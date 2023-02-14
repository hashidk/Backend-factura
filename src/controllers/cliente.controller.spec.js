const request = require('supertest');
// const app = require("../app");

describe('Pruebas para el controlador de Clientes', () => {
    test('Accediendo a un recurso - Sin autenticarse', async() => {
        const response = await request("http://localhost:8080").post("/api/cliente/info");
        expect(response.statusCode).toEqual(403);
    });

    test('Accediendo a un recurso - autenticado', async() => {
        const payload1 = {
            nickname: "1754856465", 
            password: "CIdhxRzakZrjEOsu", 
            rol: "cliente"
        }
        var response = await request("http://localhost:8080").post("/api/login").send(payload1);
        cookies = response.headers['set-cookie']

        response = await request("http://localhost:8080").get("/api/cliente/info").set('Cookie', cookies);
        expect(response.statusCode).toEqual(200);
    });

    test('Accediendo a un recurso que no pertenece a su rol - autenticado ', async() => {
        const payload1 = {
            nickname: "1754856465", 
            password: "CIdhxRzakZrjEOsu", 
            rol: "cliente"
        }
        var response = await request("http://localhost:8080").post("/api/login").send(payload1);
        cookies = response.headers['set-cookie']

        response = await request("http://localhost:8080").get("/api/empleado/info").set('Cookie', cookies);
        expect(response.statusCode).toEqual(400);
    });

    test('Obteniendo las cuentas del Cliente', async() => {
        const payload1 = {
            nickname: "1754856465", 
            password: "CIdhxRzakZrjEOsu", 
            rol: "cliente"
        }
        var response = await request("http://localhost:8080").post("/api/login").send(payload1);
        cookies = response.headers['set-cookie']

        response = await request("http://localhost:8080").get("/api/cliente/cuentas").set('Cookie', cookies);
        expect(response.statusCode).toEqual(200);
    });

    test('Obteniendo una cuenta específica del Cliente', async() => {
        const payload1 = {
            nickname: "1754856465", 
            password: "CIdhxRzakZrjEOsu", 
            rol: "cliente"
        }
        var response = await request("http://localhost:8080").post("/api/login").send(payload1);
        cookies = response.headers['set-cookie']

        response = await request("http://localhost:8080").get("/api/cliente/cuentas/410725ef-7937-410d-9696-0d2e9f0145c1").set('Cookie', cookies);
        expect(response.statusCode).toEqual(200);
    });

    test('Obteniendo una cuenta específica que no es del Cliente', async() => {
        const payload1 = {
            nickname: "1754856465", 
            password: "CIdhxRzakZrjEOsu", 
            rol: "cliente"
        }
        var response = await request("http://localhost:8080").post("/api/login").send(payload1);
        cookies = response.headers['set-cookie']

        response = await request("http://localhost:8080").get("/api/cliente/cuentas/410725ef-7937-410d-9696-0d2e9f0145c17").set('Cookie', cookies);
        expect(response.statusCode).toEqual(400);
    });

    test('Transfiriendo dinero de una cuenta a otra dentro del mismo banco', async() => {
        const payload1 = {
            nickname: "1754856465", 
            password: "CIdhxRzakZrjEOsu", 
            rol: "cliente"
        }
        var response = await request("http://localhost:8080").post("/api/login").send(payload1);
        cookies = response.headers['set-cookie']

        // Sin fondos suficientes
        response = await request("http://localhost:8080").post("/api/cliente/cuentas/410725ef-7937-410d-9696-0d2e9f0145c1/transferir/interno").send(
            {
                monto: 1900, 
                cuentaDestino: "410725ef-7937-410d-9696-0d2e9f01458ee"
            }
        ).set('Cookie', cookies);
        expect(response.statusCode).toEqual(400);

        // Superando el limite
        response = await request("http://localhost:8080").post("/api/cliente/cuentas/410725ef-7937-410d-9696-0d2e9f0145c1/transferir/interno").send(
            {
                monto: 2100, 
                cuentaDestino: "410725ef-7937-410d-9696-0d2e9f01458ee"
            }
        ).set('Cookie', cookies);
        expect(response.statusCode).toEqual(400);

        // Transfiriendo a una cuenta que no existe
        response = await request("http://localhost:8080").post("/api/cliente/cuentas/410725ef-7937-410d-9696-0d2e9f0145c1/transferir/interno").send(
            {
                monto: 2100, 
                cuentaDestino: "410725ef-7937-410d-9696-0d2e9f01458ee7"
            }
        ).set('Cookie', cookies);
        expect(response.statusCode).toEqual(400);

        // Con una cuenta que no existe o no le pertenece
        response = await request("http://localhost:8080").post("/api/cliente/cuentas/410725ef-7937-410d-9696-0d2e9f0145/transferir/interno").send(
            {
                monto: 200, 
                cuentaDestino: "410725ef-7937-410d-9696-0d2e9f01458ee"
            }
        ).set('Cookie', cookies);
        expect(response.statusCode).toEqual(400);

        // Todo correcto
        response = await request("http://localhost:8080").post("/api/cliente/cuentas/410725ef-7937-410d-9696-0d2e9f0145c1/transferir/interno").send(
            {
                monto: 200, 
                cuentaDestino: "410725ef-7937-410d-9696-0d2e9f01458ee"
            }
        ).set('Cookie', cookies);
        expect(response.statusCode).toEqual(200);
        
    });

});