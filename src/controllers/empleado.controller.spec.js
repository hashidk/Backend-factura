const request = require('supertest');
// const app = require("../app");

describe('Pruebas para el controlador de Empleados', () => {
    test('Accediendo a un recurso - Sin autenticarse', async() => {
        const response = await request("http://localhost:8080").post("/api/empleado/info");
        expect(response.statusCode).toEqual(403);
    });

    test('Accediendo a un recurso - autenticado', async() => {
        const payload1 = {
            nickname: "1777856465", 
            password: "CIdhxRzakZrjEOsu", 
            rol: "empleado"
        }
        var response = await request("http://localhost:8080").post("/api/login").send(payload1);
        cookies = response.headers['set-cookie']

        response = await request("http://localhost:8080").get("/api/empleado/info").set('Cookie', cookies);
        expect(response.statusCode).toEqual(200);
    });

    test('Obteniendo todos los clientes', async() => {
        const payload1 = {
            nickname: "1777856465", 
            password: "CIdhxRzakZrjEOsu", 
            rol: "empleado"
        }
        var response = await request("http://localhost:8080").post("/api/login").send(payload1);
        cookies = response.headers['set-cookie']

        response = await request("http://localhost:8080").get("/api/empleado/clientes").set('Cookie', cookies);
        expect(response.statusCode).toEqual(200);
    });

    test('Obteniendo todos las cuentas', async() => {
        const payload1 = {
            nickname: "1777856465", 
            password: "CIdhxRzakZrjEOsu", 
            rol: "empleado"
        }
        var response = await request("http://localhost:8080").post("/api/login").send(payload1);
        cookies = response.headers['set-cookie']

        response = await request("http://localhost:8080").get("/api/empleado/cuentas").set('Cookie', cookies);
        expect(response.statusCode).toEqual(200);
    });

    test('Agregando nuevo Cliente', async() => {
        const payload1 = {
            nickname: "1777856465", 
            password: "CIdhxRzakZrjEOsu", 
            rol: "empleado"
        }
        var response = await request("http://localhost:8080").post("/api/login").send(payload1);
        cookies = response.headers['set-cookie']

        //Nuevo Cliente
        const payload2 = {
            nombre: "Willian", 
            apellido: "Medina", 
            provincia: "Pichincha", 
            ciudad: "Quito", 
            codigo_postal: "175841", 
            identificacion: "1725489517",
            correo: "andres_mv1@hotmail.es"
        }
        response = await request("http://localhost:8080").post("/api/empleado/clientes").send(payload2).set('Cookie', cookies);
        expect(response.statusCode).toEqual(200);

        //Mismo Cliente - Error por agregar un Cliente existente
        response = await request("http://localhost:8080").post("/api/empleado/clientes").send(payload2).set('Cookie', cookies);
        expect(response.statusCode).toEqual(400);
    });

    test('Agregando nuevo cuenta', async() => {
        const payload1 = {
            nickname: "1777856465", 
            password: "CIdhxRzakZrjEOsu", 
            rol: "empleado"
        }
        var response = await request("http://localhost:8080").post("/api/login").send(payload1);
        cookies = response.headers['set-cookie']

        //Nueva Cuenta
        const payload2 = {
            tipo: "C", 
            clientes: ["b836338f-efcb-4120-be9f-8e85ec81bde8"]
        }
        response = await request("http://localhost:8080").post("/api/empleado/cuentas").send(payload2).set('Cookie', cookies);
        expect(response.statusCode).toEqual(200);
    });

});