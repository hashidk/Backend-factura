const {loggermw} = require('./logger.middleware');
const {authorization, basicAuth} = require('./auth.middleware');

module.exports = {
    loggermw,
    authorization,
    basicAuth
}