// ================= Insertar varios documentos  =======================

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




// varios documentos
const variasCuentas = [
    {
        account_holder: "Bill Gates",
        account_id: "RDGGG8944523",
        account_type: "checking",
        balance: 450,
    },
    {
        account_holder: "Elon Musk",
        account_id: "KGESDDE7483022",
        account_type: "savings",
        balance: 8400,
    },
    {
        account_holder: "Jeff Bezos",
        account_id: "HGRDS984753",
        account_type: "checking",
        balance: 2300,
    }
]



// funcion ppal
const main = async () => {
    try {

        await conectarDB()
        
        // insertando varios documentos
        let resultado = await coleccionCuentas.insertMany( variasCuentas )
        console.log( `👍 Insertados ${resultado.insertedCount} documentos` )
        console.group( resultado )
        
    
    } catch (error) {
        console.error( `❌ Error al conectarse a la base de datos '${dbnombre}: '${error}''` )
    } finally {
        cliente.close()
    }
}

main()

