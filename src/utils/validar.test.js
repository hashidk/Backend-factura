const { validNumber, validString } = require("./validar")

// describe("Probar validaciones", () => {
//     test("Validar correo", () => {
//         try {
//             email.validateAsync({correo: "andres_mv1@hotmail.es"})

//         } catch (error) {
//             expect(error).toBe(null)
//         }

//     })
// })

validNumber().monto.validateAsync({value: parseFloat("54.64")}).then(resp => {
    console.log(resp);
}).catch ((error) => {
    console.log(error.message);
})

validString("nombre").anystring.validateAsync({value: "William"}).then(resp => {
    console.log(resp);
}).catch ((error) => {
    console.log(error.message);
})