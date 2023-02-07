const {loggermw} = require('./logger.middleware');
const {authorization} = require('./auth.middleware');

module.exports = {
    loggermw,
    authorization
}