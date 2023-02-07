const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE

const cookie_config = {
    httpOnly: false,
    secure: false, //true
    maxAge: 30 * MINUTE,
    sameSite: 'none',
    // domain: '192.168.100.51:3000,192.168.100.51:3500'
}

module.exports = {
    cookie_config
}