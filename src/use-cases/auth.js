const jwt = require("jsonwebtoken");
const {handleUserDb} = require("../data-access");
const User = require("../models/user.model");
const {findOne, find, insertOne} = handleUserDb();

const SECRET_KEY = "mysecret"

module.exports = function makeAuthUsers() {
    async function verifyCredentialsUser(nickname, password) {
        // const query = { nickname, password: SHA256(password).toString() };
        const query = { nickname };

        var user = null
        try {
            user = await findOne(query)
            if (user === null) {
                return {
                    error: 'Credenciales incorrectas: correo',
                    codigo: 400,
                    user: null
                }
            }else{
                var userIns = new User(user)
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
        } catch(err) {
            return {
                error: 'Error al acceder a los datos',
                codigo: 400,
                user: null
            }
        }
    }
    
    function genJWT(user) {
        return jwt.sign({
            nickname: user.nickname
        }, SECRET_KEY);
    }
    
    async function findUser(nickname) {
        const query = { nickname };
        try {
            var resp = await findOne(query)
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
        var err = await insertOne(newUser.data);
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