const mongoose = require('mongoose');
require("dotenv").config({ path: "./src/config/.env"}); 

// Obtén la URI de conexión a la base de datos desde las variables de entorno
const mongoURI = process.env.MONGODB_URI;

// Configuración de la conexión a MongoDB
mongoose.connect(mongoURI);

// Obtén la conexión a la base de datos
const db = mongoose.connection;

// Manejador de eventos para la conexión
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
    console.log('Conexión establecida con MongoDB');
});

// Exporta la conexión para ser utilizada en otros módulos
module.exports = db;