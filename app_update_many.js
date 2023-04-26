/*
    Actualizar varios documentos a la vez se necesita:
    1) los criterios para seleccionar los documentos a actualizar
    2) las operaciones que se van a ejecutar sobre todo los documentos
*/
require('dotenv').config()
const { MongoClient } = require('mongodb')

const uri     = process.env.MONGODB_URI
const cliente = new MongoClient( uri )

const dbnombre         = 'banco'
const nombre_coleccion = 'cuentas'

// hacemos referencia a la coleccion. Si no exite la crea
const coleccionCuentas = cliente.db(dbnombre).collection(nombre_coleccion)

// Función para conectarnos a la base de datos
const conectarDB = async () => {
    try {
        await cliente.connect()
        console.log('Conectado a la base de datos 🌍')
    } catch (error) {
        console.log(`Error al conectarse a la base de datos: ${error}`)
    }
}




// Criterios de documentos a actualizar
const docsAActualizar = { account_type: 'checking' }

// Operaciones para hacer la actualizar
const opersActualizar = { $push: { transfers_complete: 'TR413308000' } }




// funcion ppal
const main = async () => {

    try {
        
        await conectarDB()

        let resultado = await coleccionCuentas.updateMany( docsAActualizar, opersActualizar )
        resultado.modifiedCount > 0
            ? console.log(`🙂 Se actualizaron ${resultado.modifiedCount} documentos`)
            : console.log('😡 No se actualizó ningun documento')

    } catch (error) {
        console.log(`Error al actualizar varios documentos: ${error}`)
    } finally {
        cliente.close()
    }

}



main()
