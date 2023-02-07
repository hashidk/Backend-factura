const Joi = require("joi")
const bcrypt = require('bcrypt');

const validacionUser = Joi.object().keys({
    email: Joi.string().empty().email().required().messages({
        "any.required": `El correo es requerido`,
        "string.empty": "Este campo no debe estar vacío",
        "string.email": `Debe ser un correo válido`,
        "string.base": "El correo debe ser un string"
    }),
    password: Joi.string().empty().min(8).required().messages({
        "any.required": `La contraseña es requerida`,
        "string.empty": "Este campo no debe estar vacío",
        "string.min": "La contraseña no debe tener una longitud menor a 8",
        "string.base": "La contraseña debe ser un string"
    }),
    nickname: Joi.string().empty().required().messages({
      "any.required": `La contraseña es requerida`,
      "string.empty": "Este campo no debe estar vacío",
      "string.base": "El nickname debe ser un string"
    })
  })

module.exports = class User {
  constructor(user){
    this.data = {
      email:    user.email,
      password: user.password || '',
      salt: user.salt || '',
      nickname: user.nickname
    }
  }

  encryptPassword(pass) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pass, salt);

    this.data.password = hash
    this.data.salt = salt
  }

  comparePassword(pass){
    return bcrypt.compareSync(pass, this.data.password);
  }

  static validar(user){
    if (!user.email || !user.password || !user.nickname)
      return 'No se encuentran todos los datos suficientes'

    let {error} = validacionUser.validate({
      email:    user.email, 
      password: user.password, 
      nickname: user.nickname
    })

    return error ? (error.details[0].message || 'error') : null;
  }
}