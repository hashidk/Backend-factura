const Servidor = require("./Servidor")
const express = require("express")
const app = express()

Servidor.runServer(app)