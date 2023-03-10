const handleCollectionDB = require("../data-access")
const empleadoDB = handleCollectionDB("Empleados");

module.exports = function makeUCEmpleados() {
    async function getMiEmpleado(nickname) {
        try {
            return await empleadoDB.findOne({'usuario.nickname':nickname});
        } catch (error) {
            throw error;
        }
    };

    async function getEmpleado(identificacion, admin_id) {
        try {
            return await empleadoDB.findOne({identificacion, admin_id});
        } catch (error) {
            throw error;
        }
    };

    async function getEmpleado(identificacion, admin_id) {
        try {
            return await empleadoDB.findOne({identificacion, admin_id});
        } catch (error) {
            throw error;
        }
    };

    async function getEmpleados(admin_id) {
        try {
            return await empleadoDB.find({admin_id});
        } catch (error) {
            throw error;
        }
    };

    async function createEmpleado(cliente) {
        try {
            await empleadoDB.insertOne(cliente);
            return null;    
        } catch (error) {
            throw error;   
        }
    }

    async function getEmpleadoById(_id, admin_id) {
        try {
            return await empleadoDB.findOne({_id, admin_id});
        } catch (error) {
            throw error;
        }
    };

    async function updateEmpleado(empleado) {
        try {
            const _id = empleado._id
            delete empleado._id
            delete empleado.identificacion
            delete empleado.admin_id
            await empleadoDB.updateOne({ _id }, {$set: empleado});
            return null;    
        } catch (error) {
            throw error;   
        }
    }

    async function changeActiveEmpleado(_id, activo) {
        try {
            if (activo) {
                await empleadoDB.updateOne({_id}, {$set: {activo:false}})
            }else{
                await empleadoDB.updateOne({_id}, {$set: {activo:true}})
            }
        } catch (error) {
            throw error; 
        }
    }

    return Object.freeze({
        getEmpleado, createEmpleado, getEmpleadoById, updateEmpleado, getEmpleados, changeActiveEmpleado,
        getMiEmpleado
    })
  }