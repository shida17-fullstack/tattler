const express = require('express');
const bodyParser = require('body-parser');
const restauranteRoutes = require('../src/v1/routes/restauranteRoutes');
const puntuacionRoutes = require('../src/v1/routes/puntuacionRoutes');
const usuarioRoutes = require('../src/v1/routes/usuarioRoutes'); 

const app = express();

// Configuraciones
app.set("port", process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: false })); // Analizar datos codificados en la URL
app.use(bodyParser.json()); // Analizar datos en formato JSON

// Rutas
app.use('/api/v1/restaurantes', restauranteRoutes);
console.log('Ruta de Restaurantes cargada');

app.use('/api/v1/puntuaciones', puntuacionRoutes); 
console.log('Ruta de Puntuaciones cargada');

app.use('/api/v1/usuarios', usuarioRoutes); 

// Exporta la aplicación Express configurada
module.exports = app;
