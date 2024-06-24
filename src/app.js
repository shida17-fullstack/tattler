const app = require('./server.js'); // Importa la configuración de Express
const db = require("./bd/conexionMongoDB.js");

// Iniciar servidor en 127.0.0.1 reemplazar por localhost en Postman o similar para todas las rutas.
app.listen(app.get('port'), () => {  // obteniendo la variable port declarada en server.js
    console.log('Servidor iniciado en el puerto', app.get('port'));//concateno con el puerto
}); 

// OTRA FORMA DE INICIAR SERVIDOR
//Iniciar servidor en 127.0.0.1
// app.listen(app.get('port'), '127.0.0.1', () => {
//     console.log(`Servidor iniciado en http://127.0.0.1:${app.get('port')}`);
// });
