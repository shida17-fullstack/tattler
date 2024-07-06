const express = require('express');
const router = express.Router();
const puntuacionController = require('../../controllers/puntuacionController.js');

// Ruta para añadir una nueva puntuación calificacion y comentario a un restaurante
router.post('/', puntuacionController.crearPuntuacion);

// Ruta para obtener todas las puntuaciones
router.get('/', puntuacionController.obtenerPuntuaciones);

// Ruta para obtener una puntuación por ID
router.get('/:id', puntuacionController.obtenerPuntuacionPorId);

// Ruta para actualizar una puntuación por ID
router.put('/:id_restaurante/:usuario_id', puntuacionController.actualizarPuntuacion);

// Ruta para eliminar una puntuación por ID
router.delete('/:id_puntuacion/:usuario_id', puntuacionController.eliminarPuntuacion);//ID Puntuacion Particular. Viene despues de Usuario Id en Array puntuaciones.

module.exports = router;
