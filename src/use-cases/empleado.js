const handleCollectionDB = require("../data-access")
const empleadoDB = handleCollectionDB("Empleados");

module.exports = function makeUCEmpleados() {
    async function getEmpleado(identificacion) {
        try {
            return await empleadoDB.findOne({identificacion});
        } catch (error) {
            throw error;
        }
    };

    async function getEmpleados() {
        try {
            return await empleadoDB.find({});
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

    async function getEmpleadoById(_id) {
        try {
            return await empleadoDB.findOne({_id});
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
        getEmpleado, createEmpleado, getEmpleadoById, updateEmpleado, getEmpleados, changeActiveEmpleado
    })
  }