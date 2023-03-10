const jwt = require("jsonwebtoken");
const handleCollectionDB = require("../data-access");
const { ErrorHTTP } = require("../models");
const User = require("../models/user.model");
const clienteDB = handleCollectionDB('Clientes');
const empleadoDB = handleCollectionDB('Empleados');
const adminDB = handleCollectionDB('Admins');

const SECRET_KEY = "mysecret"

module.exports = function makeAuthUsers() {
    async function verifyCredentialsUser(nickname, password, rol) {
        
        try {
            var user = null
            const query = { 'usuario.nickname':nickname }
            const proyection = {id_:1, usuario:1, activo:1}
            switch (rol) {
                case "cliente":
                    user = await clienteDB.findOne( query, proyection )
                    break;
                case "empleado":
                    user = await empleadoDB.findOne( query, proyection )
                    break;
                case "administrador":
                    user =  await adminDB.findOne( query, proyection )
                    break;
                default:
                    throw new ErrorHTTP('Rol incorrecto', 400);
            }

            if (user === null) {
                throw new ErrorHTTP('No existe ese usuario, verifique que haya ingresado bien los datos', 400);
            }else{
                if (user.activo === false) {
                    throw new ErrorHTTP('Lo sentimos, su usuario se encuentra desactivado', 400);
                }
                var userIns = new User(user.usuario)
                if (userIns.comparePassword(password)) {
                    return userIns.data
                }else{
                    throw new ErrorHTTP('La contraseña es incorrecta', 400);
                }
            }
            
        } catch (error) {
            throw error;   
        }
    }
    
    function genJWT(nickname, rol) {
        return jwt.sign({
            nickname: nickname,
            rol:      rol
        }, SECRET_KEY);
    }
    
    // async function findUser(nickname) {
    //     const query = { nickname };
    //     try {
    //         var resp = await hUserDB.findOne(query)
    //         return {
    //             error: null,
    //             codigo: 200,
    //             user: resp
    //         }
    //     } catch (error) {
    //         return {
    //             error: err,
    //             codigo: 400,
    //             user: null
    //         }
    //     }
    // }

    // async function createUser(user) {
    //     var verify = User.validar({
    //         nickname: user.nickname,
    //         email: user.email,
    //         password: user.password
    //     })
    //     if(verify)
    //         return {
    //             error: "Error al validar los valores: " + verify,
    //             codigo: 400
    //         }
        
    //     var newUser = new User({
    //         nickname: user.nickname,
    //         email: user.email,
    //     })
    //     newUser.encryptPassword(user.password)
    //     var err = await hUserDB.insertOne(newUser.data);
    //     if (err) 
    //         return {
    //             error: "Error al insertar los valores",
    //             codigo: 400
    //         }

    //     return {
    //         error: null,
    //         codigo: 200
    //     }
    // }

    return Object.freeze({
        verifyCredentialsUser,
        genJWT,
        // createUser,
        // findUser
    })
  }