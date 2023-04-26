/* ================================================================================
    1) Iniciar una sesion de cliente
    2) Definir las opciones de trasacción (opcional)
    3) Definir la secuencia de operaciones a realizar dentro de las transacciones
    4) Liberar los recursos utilizados por la transaccion
    Nota: Las transacciones de varios documentos tienen un limite de tiempo (60 segundos)
=================================================================================== */

require('dotenv').config()
const { MongoClient } = require('mongodb') 

const uri     = process.env.MONGODB_URI
const cliente = new MongoClient( uri )

// Colecciones
const cuentas        = cliente.db('banco').collection('cuentas')
const transferencias = cliente.db('banco').collection('transferencias')

// Información de las cuentas
let id_cuenta_envia   = 'MDBBD824563998'
let id_cuenta_recive  = 'KGESDDE7483022'
let monto_transaccion = 1000



// ====> 1) Iniciar la sesión de cliente <====
const sesion = cliente.startSession()


// usar sithTransaction para comenzar la transacción, ejecutar el callback, y confirmar la transaccion
// se debe esperar la devolución de llamada para withTransaction y pasar la sesión como argumento
// Nota: cada operación individual debe esperar y hace que la sesion pase como argumento
const main = async () => {
    try {
        
        const resultadoTransaccion = await sesion.withTransaction( async () => {
            

            // paso 1: Actualizar la cuenta del que envía
            const resultadoActualizarEnviador = await cuentas.updateOne(
                { account_id: id_cuenta_envia },
                { $inc: { balance: -monto_transaccion } },
                { sesion }
            )
            console.log(
                `${resultadoActualizarEnviador.matchedCount} documento(s) coincidieron con el filtro, actualizado ${resultadoActualizarEnviador.modifiedCount} documento(s) para la cuenta que transfiere`
            )


            // paso 2: Actualizar la cuenta del que recibe
            const resultadoActualizarRecibidor = await cuentas.updateOne(
                { account_id: id_cuenta_recive },
                { $inc: { balance: monto_transaccion } },
                { sesion }
            )
            console.log(
                `${resultadoActualizarRecibidor.matchedCount} documento(s) coincidieron con el filtro, actualizado ${resultadoActualizarRecibidor.modifiedCount} documento(s) para la cuenta que recive`
            )


            // paso 3: Insertar el documento en 'tranferencias'
            const transferencia = {
                transfer_id: 'TR21872181',
                amount: monto_transaccion,
                from_account: id_cuenta_envia,
                to_account: id_cuenta_recive
            }
            const resultadoIsertarTransferencia = await transferencias.insertOne(
                transferencia,
                { sesion }
            )
            console.log(
                `Insertado correctamente ${resultadoIsertarTransferencia.insertedId} en la colección de tranferencias`
            )


            // paso 4: Agregar el id de la transaccion en el documento del que envia 
            const resultadoAgregarIdTransEnviador = await cuentas.updateOne(
                { account_id: id_cuenta_envia },
                { $push: { transfers_complete: transferencia.transfer_id } },
                { sesion }
            )
            console.log(
                `${resultadoAgregarIdTransEnviador.matchedCount} documento(s) coincidieron con el filtro, actualizado ${resultadoAgregarIdTransEnviador.modifiedCount} documento(s) para la cuenta que envia`
            ) 


            // paso 5: Agregar el id de la transacción en el documento del que recive
            const resultadoAgregarIdTransRecividor = await cuentas.updateOne(
                { account_id: id_cuenta_recive},
                { $push: { transfers_complete: transferencia.transfer_id } },
                { sesion }
            )
            console.log(
                `${resultadoAgregarIdTransRecividor.matchedCount} documento(s) coincidieron con el filtro, actualizado ${resultadoAgregarIdTransRecividor.modifiedCount} documento(s) para la cuenta que recibe`
            )


        })


    } catch (error) {
        console.error(`Error al hacer la trasaccion: ${error}`)
        process.exit(1)
    } finally {
        await sesion.endSession()
        await cliente.close()
    }
}



main()