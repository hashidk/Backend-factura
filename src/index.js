const Servidor = require("./Servidor")
const express = require("express")
const app = express()

module.exports = function() {
    Servidor.runServer(app)
}