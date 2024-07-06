const express = require('express');
const router = express.Router();
const restauranteController = require('../../controllers/restauranteController');

router.post('/', restauranteController.crearRestaurante);
router.get('/', restauranteController.obtenerRestaurantes);
router.get('/buscar/:usuarioId', restauranteController.buscarRestaurantes); 
router.get('/:id', restauranteController.obtenerRestaurantePorId);
router.put('/:id', restauranteController.actualizarRestaurante);
router.delete('/:id', restauranteController.eliminarRestaurante);

module.exports = router;


