const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Esquema de puntuación individual
const puntuacionIndividualSchema = new Schema({
    fecha: {
        type: Date,
        default: Date.now,
        required: true,
    },
    calificacion: { type: String, required: true },
    comentario: { type: String, required: false },
    puntuacion: { type: Number, required: true },
    usuario_id: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
}, { versionKey: false });

// Esquema de puntuaciones
const puntuacionSchema = new Schema({
    id_restaurante: { type: String, ref: 'Restaurante', required: true },
    puntuaciones: [puntuacionIndividualSchema],
    ranking: { type: Number, default: 0 }
}, { versionKey: false });

// Crear el modelo Puntuacion para la colección puntuaciones
const PuntuacionModel = mongoose.model('Puntuacion', puntuacionSchema, 'puntuaciones');

module.exports = PuntuacionModel;
