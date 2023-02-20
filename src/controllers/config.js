const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
require("dotenv").config()

var secure = process.env.MODE ? process.env.MODE === "production" : false;

const cookie_config = {
    httpOnly: false,
    secure: secure, //true
    maxAge: 30 * MINUTE,
    sameSite: 'none',
    // domain: 'http://localhost:4200'
}

module.exports = {
    cookie_config
}