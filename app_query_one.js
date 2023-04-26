/*
    Para consultar por id tenemos que importar ObjectId de la librería mongodb
    Luego el criterio tenemos que instanciar con 'new ObjectId'
*/

require('dotenv').config()
const { MongoClient, ObjectId } = require('mongodb')    //==> importando también ObjectId

const uri     = process.env.MONGODB_URI
const cliente = new MongoClient( uri )

const dbnombre         = 'banco'
const nombre_coleccion = 'cuentas'

// referencia a la colección. La crea si no existe
const coleccionCuentas = cliente.db(dbnombre).collection(nombre_coleccion)

// función para conectar
const conectarDB = async () => {
    try {
        await cliente.connect()
        console.log( `Conectado a la base de datos '${dbnombre}' 🌍` )
    } catch (error) {
        console.error( `Error al conectarse a la base de datos: ${err}` )
    }
}


// criterio de busqueda
const encontrarDocumento = { _id: new ObjectId("64420989521dd85e88175192") }    //==> new ObjectId


const main = async () => {
    try {

        await conectarDB()

        // consultar un unico documento
        let resultado = await coleccionCuentas.findOne( encontrarDocumento )
        console.log( `Documento encontrado:` )
        console.log( resultado )
    
    } catch (error) {
        console.error( `Error al conectarse a la base de datos '${dbnombre}: '${error}''` )
    } finally {
        cliente.close()
    }
}

main()