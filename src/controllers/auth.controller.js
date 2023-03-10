const { makeAuthUsers, makeUCAdmins } = require("../use-cases");
const { validators, generatePasswordRand } = require("../utils");
const {verifyCredentialsUser, genJWT} = makeAuthUsers();
const { getAdmin, createAdmin } = makeUCAdmins();
const { getCookieConfig} = require('./config');
const path = require('path');
const { Administrador, Email } = require("../models")
const fs = require('fs');
require("dotenv").config()


function authControllers() {
    async function loginUser(req, res) {
        var {nickname, password, rol} = req.body
        if (!nickname || !password || !rol) 
            return res.status(400).send({message: 'Asegurese de ingresar todos los campos'})
    
        try {
            await validators.validString("identificacion").anystring.validateAsync({value: nickname})
            await validators.validString("password").anystring.validateAsync({value: password})
            await validators.validString("rol").anystring.validateAsync({value: rol})
        } catch (error) {
            return res.status(400).send({message: error.message})
        }

        try {
            var result = await verifyCredentialsUser(nickname, password, rol)
            return res.cookie("access_token", genJWT(result.nickname, rol), getCookieConfig(process.env.MODE === "production"))
                      .status(200).send({message: "Usuario autenticado", rol})

        } catch (error) {
            return res.status(error.code).send({message: error.msg})
        }

    }
    
    async function registerUser(req, res) {
        // const { image } = req.files;
        const {nombre, apellido, identificacion, empresa_nombre, empresa_dir, empresa_ciudad, empresa_provincia, empresa_pais, password, confirm_password, email} = req.body
        if (!nombre || !apellido || !identificacion || !empresa_nombre || !empresa_dir || !empresa_ciudad || !empresa_provincia || !empresa_pais || !password || !confirm_password || !email) 
            return res.status(400).send({message: 'Asegúrese de ingresar todos los campos'})
        // if (!image) {
        //     image
        //     // return res.status(400).send("No ha subido ninguna imagen")
        // };

        if (password !== confirm_password) return res.status(400).send({message: 'Las contraseñas deben ser iguales'})
        try {
            await validators.validString("nombre").anystring.validateAsync({value: nombre})
            await validators.validString("apellido").anystring.validateAsync({value: apellido})
            await validators.validString("identificacion").anystring.validateAsync({value: identificacion})
            await validators.validString("empresa_nombre").anystring.validateAsync({value: empresa_nombre})
            await validators.validString("empresa_dir").anystring.validateAsync({value: empresa_dir})
            await validators.validString("empresa_ciudad").anystring.validateAsync({value: empresa_ciudad})
            await validators.validString("empresa_provincia").anystring.validateAsync({value: empresa_provincia})
            await validators.validString("empresa_pais").anystring.validateAsync({value: empresa_pais})
            await validators.validString().password.validateAsync({value: password})
            await validators.validString().email.validateAsync({value: email})
        } catch (error) {
            return res.status(400).send({message: error.message})
        }

        var file_name, path_img;
        // if (!image) {
            path_img = "logo.png";
        // } else {
        //     if (!(/^image/.test(image.mimetype))) return res.status(400).send({message: "El archivo que subió no es una imagen"});
        //     path_img = generatePasswordRand(8)+image.name;
        //     file_name = path.join(appPathRoot,'logos', path_img);
        //     try {
        //         image.mv(file_name);
        //     } catch (error) {
        //         return res.status(500).send({message: "No se pudo subir la imagen"})
        //     }
        // }

        try {
            var admin = await getAdmin(identificacion);
            if (admin) return res.status(400).send({message: "Ya existe un usuario con esa identificación"})

            //Enviar correo
            const content = `Administrador: Su usuario es: ${identificacion} y su contraseña es: ${password}\n`;
            fs.writeFile('./test.txt', content, { flag: 'a+' }, err => console.error(err));
            new Email(email, identificacion, password).sendmail();

            var nuevoAdmin = new Administrador({ 
                nombre, apellido, identificacion, email, password, empresa_nombre,empresa_dir,empresa_ciudad,
                empresa_provincia,empresa_pais, img: path_img
            })

            await createAdmin(nuevoAdmin.admin)
            return res.status(200).send({message: "Registro exitoso"})
        } catch (error) {
            return res.status(error.code).send({message: error.msg})
        }
    }
    
    async function logOut(req, res) {
        return res.clearCookie("access_token")
                   .status(200)
                   .send({message: "Sesión terminada"})
    }

    return Object.freeze({
        loginUser,
        logOut,
        registerUser
    })
}

module.exports = authControllers