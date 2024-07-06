const usuarioService = require('../services/usuarioService');

// Crear un nuevo usuario
const crearUsuario = async (req, res) => {
    try {
        const { nombre, email, telefono, direccion } = req.body;
        const nuevoUsuario = await usuarioService.crearUsuario({ nombre, email, telefono, direccion });
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
    try {
        const { usuarios, cantidadUsuarios } = await usuarioService.obtenerUsuarios();
        res.json({ usuarios, cantidadUsuarios });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un usuario por ID
const obtenerUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await usuarioService.obtenerUsuarioPorId(id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Actualizar Usuario
const actualizarUsuario = async (req, res) => {
    try {
        const { id: userIdFromParams } = req.params; // _id del usuario desde la URL
        const { id: userIdFromBody, ...data } = req.body; // _id y otros datos desde el cuerpo

        // Verificar si el usuario que realiza la solicitud es el propietario del registro
        if (userIdFromParams !== userIdFromBody) {
            throw new Error('No tienes permiso para actualizar esta información.');
        }

        const resultado = await usuarioService.actualizarUsuario(userIdFromParams, data);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un usuario por ID
const eliminarUsuario = async (req, res) => {
    try {
        const { id: userIdFromParams } = req.params; // _id del usuario desde la URL
        const { id: userIdFromBody } = req.body; // _id del usuario desde el cuerpo

        // Verificar si los _id coinciden
        if (userIdFromParams !== userIdFromBody) {
            throw new Error('No tienes permiso para eliminar este usuario.');
        }

        // Eliminar el usuario
        await usuarioService.eliminarUsuario(userIdFromParams);

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario
};
