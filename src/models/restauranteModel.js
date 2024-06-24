const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

// Define el esquema para el restaurante
const restauranteSchema = new Schema({
    _id: { type: String, default: uuidv4 }, // Generar UUID automáticamente
    nombre: { type: String, required: true },
    direccion: {
        calle: { type: String, required: true },
        codigo_postal: { type: String, required: true },
        coordenadas: { type: [Number], required: true }
    },
    barrio: { type: String, required: true },
    cocina: { type: String, required: true }
}, {
    versionKey: false // Esto desactiva el campo __v
});

// Agregar el índice 2dsphere en el campo 'coordenadas' para consultas geoespaciales
restauranteSchema.index({ coordenadas: '2dsphere' });

// Agregar índice compuesto en 'nombre' y 'barrio'
restauranteSchema.index({ nombre: 1, barrio: 1 });

// Crea el modelo Restaurante para la colección restaurantes
const RestauranteModel = mongoose.model('Restaurante', restauranteSchema, 'restaurantes');

module.exports = RestauranteModel;
