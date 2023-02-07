const {makeAuthUsers} = require("../use-cases")
const {verifyCredentialsUser, genJWT, findUser, createUser} = makeAuthUsers()
const {cookie_config} = require('./config');

function authControllers() {
    async function loginUser(req, res) {
        var {nickname, password} = req.body
        if (!nickname || !password)
            return res.status(400).send('Asegurese de ingresar todos los campos')
        
        verifyCredentialsUser(nickname.toLocaleLowerCase(), password).then(result => {
            if (result.error)
                res.status(result.codigo).send(result.error)
            else{
                console.log(result);
                return res.cookie("access_token", genJWT(result.user), cookie_config)
                          .status(200).send("Todo bien")
            }
        })
    }
    
    async function registerUser(req, res) {
        const {nickname, password, confirm_password, email} = req.body
        if (!nickname || !password || !confirm_password || !email) 
            return res.status(400).send('Asegurese de ingresar todos los campos')
            
        if (password !== confirm_password) return res.status(400).send('Las contraseñas deben ser iguales')
        
        try {
            var result = await findUser(nickname.toLocaleLowerCase());
            if (result.error)
                return res.status(result.codigo).send(result.error)
            if (result.user)
                return res.status(400).send("Usuario ya existe")
    
            var result1 = await createUser({nickname: nickname.toLocaleLowerCase(), password, email});
            if (result1.error)
                return res.status(result1.codigo).send(result1.error)

            result = await findUser(nickname.toLocaleLowerCase());
            if (result.error)
                return res.status(result.codigo).send(result.error)

            return res.cookie("access_token", genJWT(result.user), cookie_config)
                .status(200).send("Todo bien")

        } catch (error) {
            console.log(error);
            return res.status(400).send('Algo ocurrió')
        }
    }
    
    async function logOut(req, res) {
        return res.clearCookie("access_token")
                   .status(200)
                   .send("Cerrada la sesión")
    }

    return Object.freeze({
        registerUser,
        loginUser,
        logOut
    })
}

module.exports = authControllers