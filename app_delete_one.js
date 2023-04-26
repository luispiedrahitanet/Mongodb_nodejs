/* ========== Eliminando un solo documento ============ */

require('dotenv').config()
const { MongoClient, ObjectId } = require('mongodb')

const uri     = process.env.MONGODB_URI
const cliente = new MongoClient( uri )

const dbnombre         = 'banco'
const nombre_coleccion = 'cuentas'

// hacemos referencia a la coleccion. Si no existe la crea
const coleccion = cliente.db(dbnombre).collection(nombre_coleccion)


// Conexión a la base de datos
const conectarDB = async () => {
    try {
        await cliente.connect()
        console.log('Conectado a la base de datos 🌍')
    } catch (error) {
        console.error(`Error al conectar a la base de datos: ${error}`)
    }
}




// criterio con el identificador del documento a eliminar
const docAEliminar = { _id: new ObjectId('64420989521dd85e88175192') } 




// funcion principal
const main = async () => {
    try {

        await conectarDB()
        
        const resultado = await coleccion.deleteOne( docAEliminar )
        resultado.deletedCount === 1
            ? console.log('✔ Eliminado un documento')
            : console.log('😡 No se eliminó el documento')

    } catch (error) {
        console.log( `Error al eliminar el documento: ${error}` )
    } finally {
        await cliente.close()
    }
}



main()