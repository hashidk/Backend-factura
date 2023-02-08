const jwt = require("jsonwebtoken");
const handleCollectionDB = require("../data-access");
const User = require("../models/user.model");
const clienteDB = handleCollectionDB('Clientes');
const empleadoDB = handleCollectionDB('Empleados');

const SECRET_KEY = "mysecret"

module.exports = function makeAuthUsers() {
    async function verifyCredentialsUser(nickname, password, rol) {
        
        try {
            var user = null
            switch (rol) {
                case "cliente":
                    user = await clienteDB.findOne({ identificacion: nickname }, { "usuario":1, "nombre":0 })
                    break;
                case "empleado":
                    user = await empleadoDB.findOne({ identificacion: nickname }, { usuario:1 })
                    break;
                default:
                    return {
                        error: 'Rol incorrecto',
                        codigo: 400,
                        user: null
                    }
            }

            if (user === null) {
                return {
                    error: 'Credenciales incorrectas: correo',
                    codigo: 400,
                    user: null
                }
            }else{
                var userIns = new User(user.usuario)
                if (userIns.comparePassword(password)) {
                    return {
                        error: null,
                        codigo: 200,
                        user: userIns.data
                    }
                }else{
                    return {
                        error: 'Credenciales incorrectas; contraseña',
                        codigo: 400,
                        user: null
                    }     
                }
            }
            
        } catch (error) {
            return {
                error: 'Error al acceder a los datos',
                codigo: 400,
                user: null
            }
        }
    }
    
    function genJWT(nickname, rol) {
        return jwt.sign({
            nickname: nickname,
            rol:      rol
        }, SECRET_KEY);
    }
    
    async function findUser(nickname) {
        const query = { nickname };
        try {
            var resp = await hUserDB.findOne(query)
            return {
                error: null,
                codigo: 200,
                user: resp
            }
        } catch (error) {
            return {
                error: err,
                codigo: 400,
                user: null
            }
        }
    }

    async function createUser(user) {
        var verify = User.validar({
            nickname: user.nickname,
            email: user.email,
            password: user.password
        })
        if(verify)
            return {
                error: "Error al validar los valores: " + verify,
                codigo: 400
            }
        
        var newUser = new User({
            nickname: user.nickname,
            email: user.email,
        })
        newUser.encryptPassword(user.password)
        var err = await hUserDB.insertOne(newUser.data);
        if (err) 
            return {
                error: "Error al insertar los valores",
                codigo: 400
            }

        return {
            error: null,
            codigo: 200
        }
    }

    return Object.freeze({
        verifyCredentialsUser,
        genJWT,
        createUser,
        findUser
    })
  }