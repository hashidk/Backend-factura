class Logger {
    static logInfo(mensaje){
        console.log(`\x1b[1;34m [INFO] ${mensaje}\x1b[0m`);
    }

    static logErr(mensaje){
        console.log(`\x1b[31m [ERROR] ${mensaje}\x1b[0m`);
    }

    static logWarn(mensaje){
        console.log(`\x1b[33m [WARNING] ${mensaje}\x1b[0m`);
    }

    static logDebug(mensaje){
        console.log(`\x1b[1;33m [DEBUG] ${mensaje}\x1b[0m`);
    }
}

module.exports = {Logger}