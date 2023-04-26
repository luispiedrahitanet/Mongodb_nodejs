require('dotenv').config()
const { MongoClient } = require('mongodb')

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
// const documentosMayoresA = { account_type: "checking" }  // iguales a 'checking'
const documentosMayoresA = { balance: {$gt: 4700} }     // mayor a 


const main = async () => {
    try {

        await conectarDB()

        // consultando los documentos con balance mayores a 4700
        let resultados    = coleccionCuentas.find( documentosMayoresA )
        let totDocumentos = coleccionCuentas.countDocuments( documentosMayoresA )
        await resultados.forEach( (doc) => console.log(doc) )
        console.log( `Existen ${await totDocumentos} documentos que cumplen con el criterio` )
    
    } catch (error) {
        console.error( `Error al conectarse a la base de datos '${dbnombre}: '${error}''` )
    } finally {
        cliente.close()
    }
}

main()