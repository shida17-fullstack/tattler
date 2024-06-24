const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define el esquema para el usuario
const usuarioSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true }, // Se usa ObjectId para el _id
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefono: { type: String },
    direccion: { type: String }
}, {
    versionKey: false // Esto desactiva el campo __v
});

// Crea el modelo Usuario para la colección usuarios
const UsuarioModel = mongoose.model('Usuario', usuarioSchema, 'usuarios');

module.exports = UsuarioModel;
