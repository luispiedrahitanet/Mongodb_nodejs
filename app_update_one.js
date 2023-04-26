/*
    Actualizar un solo documento se necesita:
    1) el documento a actualizar
    2) las operaciones que se van a ejecutar sobre ese objeto
*/

require('dotenv').config()
const { MongoClient, ObjectId } = require('mongodb')

const uri     = process.env.MONGODB_URI
const cliente = new MongoClient( uri )

const dbnombre = 'banco'
const nombre_coleccion = 'cuentas'

// hacemos referencia a la coleccion. Si no existe la crea automáticamente
const coleccionCuentas = cliente.db(dbnombre).collection(nombre_coleccion)

// Conexion a la base de datos
const conectarDB = async () => {
    try {
        await cliente.connect()
        console.log('Conectado a la base de datos 🌍')
    } catch (error) {
        console.error(`Error al conectarse a la base de datos: ${error}`)
    }
}



// documento que se va a actualizar
const docAActualizar = { _id: new ObjectId('64420989521dd85e88175191') }

// Operacion(es) para actualizar el documento
const operacionesAcutalizar = { $inc: { balance: 100 } }



// funcion ppal
const main = async () => {
    try {

        await conectarDB()

        const resultado = await coleccionCuentas.updateOne( docAActualizar, operacionesAcutalizar )
        resultado.modifiedCount === 1 
            ? console.log('🙂 Modificado un documento')
            : console.log('😡 No se modificó ningun documento')

    } catch (error) {
        console.log(`Error al actualizar el documento`)
    } finally {
        cliente.close()
    }
}


main()
