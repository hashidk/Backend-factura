const {Logger} = require('../Logger');
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

function loggermw(req, res, next){
    let date = new Date()
    Logger.logDebug(` [${req.method}]\tAccedido ${date.toLocaleString("es-EC")}\tal recurso: ${req.url}\tdesde ${req.ip}`);    
    next()
}

module.exports = {
    loggermw
}

