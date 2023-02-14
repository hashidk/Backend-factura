const TransferenciaInterna = require('./transf_interna.model');

describe("Pruebas con la clase Transferencias Internas", () => {
        test("Creando un Transferencia", () => {
            const transferenciaInterna = new TransferenciaInterna({
                monto: 500,
                origen: "sdd",
                destino: "ssf",
            })

            expect(transferenciaInterna.tranferInt._id).not.toBe("")
            expect(transferenciaInterna.tranferInt.cuenta_destino).not.toBe("")
            expect(transferenciaInterna.tranferInt.cuenta_origen).not.toBe("")
            expect(transferenciaInterna.tranferInt.moneda).not.toBe("")
            expect(transferenciaInterna.tranferInt.monto).not.toBe("")

        });

        test("Verificando el limite de una transacción", () => {
            expect(TransferenciaInterna.verificarLimite(500)).toBe(true)
            expect(TransferenciaInterna.verificarLimite(2500)).toBe(false)
        });

        test("Verificando sean distintas cuentas", () => {
            expect(TransferenciaInterna.verificarDiffCuentas("sss", "ssd")).toBe(true)
            expect(TransferenciaInterna.verificarDiffCuentas("sss", "sss")).toBe(false)
        });

})