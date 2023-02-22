const handleCollectionDB = require("../data-access")
const cuentaDB = handleCollectionDB("Cuentas");
const clienteDB = handleCollectionDB("Clientes");
const transferenciasIntDB = handleCollectionDB("TransferenciasInternas");
const transferenciasExtDB = handleCollectionDB("TransferenciasExternas");
const {TransferenciaInterna, ErrorHTTP, TransferenciaExterna} = require("../models")
const { default: axios } = require("axios");

module.exports = function makeUCCuentas() {
    async function getCuentas() {
        try {
            return await cuentaDB.find({});
        } catch (error) {
            throw error;
        }
    };

    async function getCuentasByCliente(identificacion) {
        try {
            var cliente = await clienteDB.findOne({identificacion})
            var cuentas = await cuentaDB.find({ clientes: { $all: [ cliente._id ] }, activo:true })
            return cuentas;
        } catch (error) {
            throw error;
        }
    };

    async function getCuentaById(idCuenta) {
        try {
            return await cuentaDB.findOne({ _id: idCuenta });
        } catch (error) {
            throw error;
        }
    };

    async function getCuentaByCliente(identificacion, idCuenta) {
        try {
            var cliente = await clienteDB.findOne({identificacion})
            var cuenta = await cuentaDB.findOne({ _id: idCuenta, clientes: { $all: [ cliente._id ] } })
            if (!cuenta) throw new ErrorHTTP("No posee esta cuenta o no es parte de ella", 400)
            var clientes = await clienteDB.find({ _id: { $in: cuenta.clientes } }, {_id:1, nombre:1, apellido:1})
            cuenta.clientes = clientes;
            return cuenta;
        } catch (error) {
            throw error;
        }
    };

    async function getCuentasDiffById(idCuenta) {
        try {
            var cuentas = await cuentaDB.find({ _id: { $ne: idCuenta } });
            return cuentas;
        } catch (error) {
            throw error;
        }
    }

    async function createCuenta(cuenta) {
        try {
            await cuentaDB.insertOne(cuenta);
            return null;    
        } catch (error) {
            throw error;   
        }
    }

    async function transferInternAsTransaction(cuentaOrigen, cuentaDestino, monto) {
        
        var val = null
        try {
            const {options, session} = await cuentaDB.createSession()
            await session.withTransaction(async () => {
                await cuentaDB.updateOne({ _id : cuentaOrigen  }, { $inc: { monto: -monto } }, { session });
                await cuentaDB.updateOne({ _id : cuentaDestino }, { $inc: { monto } }, { session });
            }, options);
        } catch (e) {
            val = e
        } finally {
            await session.endSession();
            return val
        }
    }

    async function transferInternAsNonTransaction(cuentaOrigen, cuentaDestino, monto) {
        try {
            await cuentaDB.updateOne({ _id : cuentaOrigen  }, { $inc: { monto: -monto } });
            await cuentaDB.updateOne({ _id : cuentaDestino }, { $inc: { monto } });
            
            const ti = new TransferenciaInterna({monto ,origen: cuentaOrigen,destino: cuentaDestino})
            await transferenciasIntDB.insertOne(ti.tranferInt)

            return null
        } catch (error) {
            throw error;
        }
    }

    async function addTranferenciaExterna(cuentaOrigen, cuentaDestino, monto, banco) {
        try {
            const te = new TransferenciaExterna({monto, origen: cuentaOrigen, destino: cuentaDestino, banco})
            await transferenciasExtDB.insertOne(te.tranferExt)
        } catch (error) {
            throw error;
        }
    }

    async function changeActiveCuenta(_id, activo) {
        try {
            if (activo) {
                await cuentaDB.updateOne({_id}, {$set: {activo:false}})
            }else{
                await cuentaDB.updateOne({_id}, {$set: {activo:true}})
            }
        } catch (error) {
            throw error; 
        }
    }

    async function updateCuenta(cuenta) {
        try {
            const _id = cuenta._id
            delete cuenta._id
            delete cuenta.clientes
            await cuentaDB.updateOne({ _id }, {$set: cuenta});
            return null;    
        } catch (error) {
            throw error;   
        }
    }

    async function testBanco(URL) {
        try {
            await axios.get(URL)
        } catch (error) {
            throw new ErrorHTTP("No hay conexión con el banco, vuelva a intentar más tarde", 500)
        }
    }

    async function reqTransferirBanco(URL, username, password, monto, cuentaOrigen, cuentaDestino, nombreBanco) {
        try {
            await axios.post(
                URL, 
                {monto, cuentaDestino, cuentaOrigen, nombreBanco}, 
                {
                    withCredentials:true, 
                    auth: {
                        username,
                        password
                      }
                })
        } catch (error) {
            throw new ErrorHTTP("No se puedo transferir", 400)
        }
    }

    return Object.freeze({
        getCuentas, getCuentasByCliente, getCuentaById, getCuentaByCliente, getCuentasDiffById,
        createCuenta, transferInternAsTransaction, transferInternAsNonTransaction, updateCuenta,
        changeActiveCuenta, reqTransferirBanco, testBanco, addTranferenciaExterna
    })
  }