
const jwt = require("jsonwebtoken");
const SECRET_KEY = "mysecret"

const {handleUserDb} = require("../data-access");
const {findOne} = handleUserDb();

const authorization = async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(403).send("Inicie sesión para poder ingresar");
    }

    try {
      const data = jwt.verify(token, SECRET_KEY);
      const query = { nickname: data.nickname.toLocaleLowerCase()};

      var respuesta = await findOne(query)
      if (!respuesta)
        return res.status(403).send('No se pudo autenticarle, vuelva a intentar')

      return next();
    } catch(err) {
      return res.status(403).send("Falla al obtener el token: " + err);
    }
  };

  module.exports = {
    authorization
  }