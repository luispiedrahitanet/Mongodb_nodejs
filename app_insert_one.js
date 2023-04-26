// =========== Insertar un solo documento =============

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


// un solo documento
const unaCuenta = {
	account_holder: "Linus Torvalds",
	account_id: "MDBBD824563998",
	account_type: "checking",
	balance: 5900,
	last_update: new Date(),
}



const main = async () => {
    try {

        await conectarDB()
        
        // insertando un solo dcumento
        let resultado = await coleccionCuentas.insertOne( unaCuenta )
        console.log( `👍 Documento instertado: ${resultado.insertedId}` )
        
    
    } catch (error) {
        console.error( `Error al conectarse a la base de datos '${dbnombre}: '${error}''` )
    } finally {
        cliente.close()
    }
}

main()

