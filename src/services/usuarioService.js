const Usuario = require('../models/usuarioModel');
const { handleError } = require('../utils/errorHandler');

// Crear un nuevo usuario
const crearUsuario = handleError(async (data) => {
    const { nombre, email, telefono, direccion } = data;
    const usuario = new Usuario({ nombre, email, telefono, direccion });
    const nuevoUsuario = await usuario.save();
    return { mensaje: 'Usuario creado exitosamente.', usuario: nuevoUsuario };
});


// Obtener todos los usuarios y ordenar por índices creados
const obtenerUsuarios = handleError(async () => {
    const usuarios = await Usuario.find().sort({ _id: 1 }); // Ordena por el índice _id de manera ascendente (1) o descendente (-1)
    const cantidadUsuarios = await Usuario.countDocuments();
    return { usuarios, cantidadUsuarios };
});

// Obtener un usuario por ID
const obtenerUsuarioPorId = handleError(async (id) => {
    return await Usuario.findById(id);
});

// Actualizar un usuario por ID
const actualizarUsuario = handleError(async (id, data) => {
    const { nombre, email, telefono, direccion } = data;

    // Verificar si el usuario existe
    const usuarioExistente = await Usuario.findById(id);
    if (!usuarioExistente) {
        throw new Error('Usuario no encontrado');
    }

    // Si los datos proporcionados no incluyen nombre, email o telefono, usar los valores existentes
    const actualizacion = {
        nombre: nombre ?? usuarioExistente.nombre,
        email: email ?? usuarioExistente.email,
        telefono: telefono ?? usuarioExistente.telefono,
        direccion: {
            calle: direccion.calle ?? usuarioExistente.direccion.calle,
            codigo_postal: direccion.codigo_postal ?? usuarioExistente.direccion.codigo_postal,
            coordenadas: direccion.coordenadas ?? usuarioExistente.direccion.coordenadas,
        }
    };

    // Actualizar el usuario
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
        id,
        actualizacion,
        { new: true }
    );

    return { mensaje: 'Usuario actualizado exitosamente.', usuario: usuarioActualizado };
});

// Eliminar un usuario por ID
const eliminarUsuario = handleError(async (id) => {
    // Verificar si el usuario existe
    const usuarioExistente = await Usuario.findById(id);
    if (!usuarioExistente) {
        throw new Error('Usuario no encontrado');
    }

    // Eliminar el usuario
    await Usuario.findByIdAndDelete(id);
    return { mensaje: `Usuario ${usuarioExistente.nombre} eliminado exitosamente.` };
});


module.exports = {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario
};
