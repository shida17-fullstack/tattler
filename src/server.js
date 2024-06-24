const express = require("express");
const bodyParser = require("body-parser");
const importRoutes = require('./v1/routes/importRoutes.js');

const app = express();

// Configuraciones
app.set("port", process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: false })); // Analizar datos codificados en la URL
app.use(bodyParser.json()); // Analizar datos en formato JSON

// Recordar usar: http://127.0.0.1:3000/
// Usar las rutas de usuarios bajo la ruta base '/api/v1'
app.use('/api/v1', importRoutes);
console.log('Ruta de Importacion cargada');

// Exporta la aplicación Express configurada
module.exports = app;
