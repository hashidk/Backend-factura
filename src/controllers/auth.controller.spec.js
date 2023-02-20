const request = require('supertest');
// const app = require("../app");

describe('Pruebas para el controlador de Autenticación', () => {
    test('Control de acceso - Sin autenticarse', async() => {
        const response = await request("http://localhost:8080").post("/api/logout");
        expect(response.statusCode).toEqual(403);
    });

    test('Autenticandose', async() => {
        //Caso en el que no
        const payload = {
            nickname: "will", 
            password: "12345", 
            rol: "cliente"
        }
        var response = await request("http://localhost:8080").post("/api/login").send(payload);
        expect(response.statusCode).toEqual(400);
        var cookies = response.headers['set-cookie']
        expect(cookies).toBe(undefined);

        //Caso en el que si
        const payload1 = {
            nickname: "1754856465", 
            password: "CIdhxRzakZrjEOsu", 
            rol: "cliente"
        }
        response = await request("http://localhost:8080").post("/api/login").send(payload1);
        expect(response.statusCode).toEqual(200);
        cookies = response.headers['set-cookie']
        expect(cookies).not.toBe(undefined);

    });

    test('Control de acceso - Con autenticarse', async() => {
        const payload1 = {
            nickname: "1754856465", 
            password: "CIdhxRzakZrjEOsu", 
            rol: "cliente"
        }
        var response = await request("http://localhost:8080").post("/api/login").send(payload1);
        cookies = response.headers['set-cookie']

        response = await request("http://localhost:8080").post("/api/logout").set('Cookie', cookies);
        expect(response.statusCode).toEqual(200);
        // expect(2==2).toBe(true)

    });
});