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
    cocina: { type: String, required: true },
    horario: {
        lunes: { apertura: String, cierre: String },
        martes: { apertura: String, cierre: String },
        miercoles: { apertura: String, cierre: String },
        jueves: { apertura: String, cierre: String },
        viernes: { apertura: String, cierre: String },
        sabado: { apertura: String, cierre: String },
        domingo: { apertura: String, cierre: String },
    },
    zona_horaria: { type: String, required: true } // Campo de zona horaria
}, {
    versionKey: false // Esto desactiva el campo __v
});

// Indice 2dsphere en el campo 'direccion.coordenadas' para consultas geoespaciales
restauranteSchema.index({ 'direccion.coordenadas': '2dsphere' });

// Indice compuesto en 'nombre' y 'barrio'
restauranteSchema.index({ nombre: 1, barrio: 1 });

// Modelo Restaurante para la colección restaurantes
const RestauranteModel = mongoose.model('Restaurante', restauranteSchema, 'restaurantes');

module.exports = RestauranteModel;
