module.exports = class ErrorHTTP {
    constructor(msg, code){
        this.msg = msg
        this.code = code
    }
}