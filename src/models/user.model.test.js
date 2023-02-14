const User = require('./user.model');

describe("Pruebas con el Usuario", () => {
        test("Creando un Usuario", () => {
            const user = new User({
                nickname: "Will",
                email: "as@a.com"
            })

            expect(user.data.nickname).not.toBe("")
            expect(user.data.email).not.toBe("")
            expect(user.data.password).toBe("")
            expect(user.data.salt).toBe("")
        });

        test("Añadiendo la contraseña a un Usuario", () => {
            const user = new User({
                nickname: "Will",
                email: "as@a.com"
            })

            user.encryptPassword("12345")

            expect(user.data.password).not.toBe("")
            expect(user.data.salt).not.toBe("")
        });

        test("Comparando la contraseña a un Usuario", () => {
            const user = new User({
                nickname: "Will",
                email: "as@a.com"
            })
            user.encryptPassword("12345")

            expect(user.comparePassword("12345")).toBe(true)
            expect(user.comparePassword("123456")).toBe(false)

        });

        test("Validando datos de un Usuario", () => {

            expect(User.validar({
                nickname: "Will",
                email: "as@a.com",
                password: "12345"
            })).not.toBe(null)
            
            expect(User.validar({
                nickname: "Will",
                email: "as",
                password: "12345"
            })).not.toBe(null)

            expect(User.validar({
                nickname: "Will",
                email: "as@a.com",
                password: "12345678"
            })).toBe(null)

        });
})