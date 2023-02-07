const Logger = require("./Logger").Logger
const DB = require("./Database") 
const routes = require("./routes")
const middlewares = require("./middlewares")
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const cookieParser = require("cookie-parser");

function runServer(app) {
    DB.initConnection().then( () =>{
        app.enable('trust proxy')
        app.use(cors())
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(middlewares.loggermw)
        app.use(cookieParser());
        app.use("/api/", routes)
        app.use(express.static('public'));

        app.listen("8080", () => {
            Logger.logInfo("Servidor abierto en http://localhost:8080")
        })   
    })
}

module.exports = {runServer}