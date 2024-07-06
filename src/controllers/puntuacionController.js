const PuntuacionService = require('../services/puntuacionService');

//Crear Puntuacion
const crearPuntuacion = async (req, res) => {
    const { id_restaurante, usuario_id, calificacion, comentario, puntuacion } = req.body;

    try {
        const puntuacionActualizada = await PuntuacionService.crearPuntuacion({
            id_restaurante,
            usuario_id,
            calificacion,
            comentario,
            puntuacion
        });

        res.status(201).json(puntuacionActualizada);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//Obtener Puntuaciones
const obtenerPuntuaciones = async (req, res) => {
    try {
        const puntuaciones = await PuntuacionService.obtenerPuntuaciones();

        res.json({
            total: puntuaciones.length,
            data: puntuaciones
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Obtener una puntuación por su ID
const obtenerPuntuacionPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const puntuacion = await PuntuacionService.obtenerPuntuacionPorId(id);
        if (!puntuacion) {
            return res.status(404).json({ message: 'Puntuación no encontrada' });
        }
        res.json(puntuacion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar una puntuación
const actualizarPuntuacion = async (req, res) => {
    const { id_restaurante, usuario_id } = req.params;
    const { calificacion, comentario, puntuacion } = req.body;

    try {
        const puntuacionActualizada = await PuntuacionService.actualizarPuntuacion(id_restaurante, usuario_id, {
            calificacion,
            comentario,
            puntuacion
        });

        res.json(puntuacionActualizada);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//Eliminar una puntuación
const eliminarPuntuacion = async (req, res) => {
    const { id_puntuacion, usuario_id } = req.params;

    try {
        await PuntuacionService.eliminarPuntuacion(id_puntuacion, usuario_id);
        res.json({ message: 'Puntuación eliminada exitosamente' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    crearPuntuacion,
    obtenerPuntuaciones, 
    obtenerPuntuacionPorId,
    actualizarPuntuacion,
    eliminarPuntuacion
};
