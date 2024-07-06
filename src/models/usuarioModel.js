const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define el esquema para el usuario
const usuarioSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true }, // Se usa ObjectId para el _id
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefono: { type: String },
    direccion: {
        calle: { type: String, required: true },
        codigo_postal: { type: String, required: true },
        coordenadas: { 
            type: [Number], 
            required: true
        }
    }
}, {
    versionKey: false // Esto desactiva el campo __v
});

// Indice 2dsphere en el campo 'direccion.coordenadas' para consultas geoespaciales
usuarioSchema.index({ 'direccion.coordenadas': '2dsphere' });

// Modelo Usuario para la colección usuarios
const UsuarioModel = mongoose.model('Usuario', usuarioSchema, 'usuarios');

module.exports = UsuarioModel;

