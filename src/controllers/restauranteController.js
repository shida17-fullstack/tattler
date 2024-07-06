const restauranteService = require('../services/restauranteService');


// Crear un restaurante
const crearRestaurante = async (req, res) => {
    try {
        const data = req.body;
        const nuevoRestaurante = await restauranteService.crearRestaurante(data);
        res.status(201).json({ message: 'Restaurante creado exitosamente', restaurante: nuevoRestaurante });
    } catch (error) {
        if (error.message === 'El restaurante ya existe') {
            res.status(409).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'Error al crear el restaurante: ' + error.message });
        }
    }
};

// Obtener todos los restaurantes
const obtenerRestaurantes = async (req, res) => {
    try {
        const restaurantes = await restauranteService.obtenerRestaurantes();
        res.status(200).json(restaurantes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los restaurantes: ' + error.message });
    }
};

// Obtener un restaurante por ID
const obtenerRestaurantePorId = async (req, res) => {
    try {
        const id = req.params.id;
        const restauranteData = await restauranteService.obtenerRestaurantePorId(id);
        
        if (restauranteData.restaurante) {
            const { restaurante, estado } = restauranteData;
            res.status(200).json({
                restaurante: {
                    ...restaurante.toObject(),
                    estado: estado
                }
            });
        } else {
            res.status(404).json({ message: 'Restaurante no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el restaurante: ' + error.message });
    }
};


// Actualizar un restaurante
const actualizarRestaurante = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const resultado = await restauranteService.actualizarRestaurante(id, data);

        if (resultado.noCambio) {
            res.status(200).json({ message: 'No se realizaron cambios, los datos son los mismos', restaurante: resultado.restaurante });
        } else {
            res.status(200).json({ message: 'Restaurante actualizado exitosamente', restaurante: resultado.restaurante });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el restaurante: ' + error.message });
    }
};

// Eliminar un restaurante
const eliminarRestaurante = async (req, res) => {
    try {
        const id = req.params.id;
        const restauranteEliminado = await restauranteService.eliminarRestaurante(id);
        res.status(200).json({ message: 'Restaurante eliminado exitosamente', restaurante: restauranteEliminado });
    } catch (error) {
        if (error.message === 'Restaurante no encontrado') {
            res.status(404).json({ message: 'Restaurante no encontrado' });
        } else {
            res.status(500).json({ message: 'Error al eliminar el restaurante: ' + error.message });
        }
    }
};

//Buscar Restaurantes
const buscarRestaurantes = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const { nombre, cocina } = req.body;
        const resultado = await restauranteService.buscarRestaurantes(usuarioId, nombre, cocina);
        
        res.status(200).json({
            mensaje: resultado.mensaje,
            restaurantes: resultado.restaurantes
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    crearRestaurante,
    obtenerRestaurantes,
    obtenerRestaurantePorId,
    actualizarRestaurante,
    eliminarRestaurante,
    buscarRestaurantes
};
