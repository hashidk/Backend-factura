
const jwt = require("jsonwebtoken");
const SECRET_KEY = "mysecret"

const handleCollectionDB = require("../data-access");
const clienteDB = handleCollectionDB("Clientes");

const authorization = async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(403).send("Inicie sesión para poder ingresar");
    }

    const data = jwt.verify(token, SECRET_KEY);
    var user = null;

    try {
      switch (data.rol) {
        case "cliente":
            user = await clienteDB.findOne({ identificacion: data.nickname })
            break;
        case "empleado":
            user = await empleadoDB.findOne({ identificacion: data.nickname })
            break;
        default:
            return res.status(400).send("Rol incorrecto");
      }

      if (req.baseUrl.split("/").slice(-1)[0] !== data.rol) {
        return res.status(400).send("Acceso no autorizado");
      }

      if (!user) {
        return res.status(403).send('No se pudo autenticarle, vuelva a intentar')
      }else{
        res.locals.user = data
        return next();
      }
    } catch(err) {
      return res.status(403).send("Falla al obtener el token: " + err);
    }
  };

  module.exports = {
    authorization
  }