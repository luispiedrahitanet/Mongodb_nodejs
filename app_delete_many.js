/* ================= Eliminar varios documentos ================== */

require('dotenv').config()
const { MongoClient } = require('mongodb')

const uri     = process.env.MONGODB_URI
const cliente = new MongoClient( uri )


const dbnombre         = 'banco'
const nombre_coleccion = 'cuentas'

// hacemos referencia a la coleccion de documentos. Si no existe se crea automáticamente
const coleccion = cliente.db(dbnombre).collection(nombre_coleccion)



// conexión a la base de datos
const conectarDB = async () => {
    try {
        await cliente.connect()
        console.log('🌍 conectado a la base de datos')
    } catch (error) {
        console.log(`Error al conectar con la base de datos: ${error}`)
    }
}



// criterio de filtrado para eliminar varios documentos
const docsAEliminar = { balance: { $lt: 500 } }



// funcion ppal
const main = async () => {
    try {
        
        await conectarDB()

        const resultado = await coleccion.deleteMany( docsAEliminar )
        resultado.deletedCount > 0
            ? console.log(`✔ Eliminados ${resultado.deletedCount} documentos`)
            : console.log('😡 No se eliminaron documentos')

    } catch (error) {
        console.log(`Error al tratar de eliminar documentos de la base de datos`)
    } finally {
        await cliente.close()
    }
}

main()
