const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
require("dotenv").config()

function getCookieConfig(secure) {
    return {
        httpOnly: false,
        secure: secure, //true
        maxAge: 30 * MINUTE,
        sameSite: 'none',
        // domain: 'http://localhost:4200'
    }
}


module.exports = {
    getCookieConfig
}