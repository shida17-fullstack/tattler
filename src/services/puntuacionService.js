const Puntuacion = require('../models/puntuacionModel');
const { handleError } = require('../utils/errorHandler');


// Función para interpretar el ranking
const interpretarRanking = (ranking) => {
    if (ranking >= 4.5) return 'Excelente';
    if (ranking >= 3.5) return 'Bueno';
    if (ranking >= 2.5) return 'Regular';
    if (ranking >= 1.5) return 'Malo';
    return 'Muy Malo';
};

// Crear Puntuacion (con y sin comentario)
const crearPuntuacion = handleError(async (data) => {
    const { id_restaurante, usuario_id, calificacion, comentario, puntuacion } = data;

    // Verificar que calificacion y puntuacion estén presentes
    if (!calificacion || !puntuacion) {
        throw new Error('Calificacion y Puntuacion son campos obligatorios.');
    }

    // Buscar el documento de puntuación del restaurante
    let puntuacionRestaurante = await Puntuacion.findOne({ id_restaurante });

    // Si no existe, crea uno nuevo
    if (!puntuacionRestaurante) {
        puntuacionRestaurante = new Puntuacion({ id_restaurante, puntuaciones: [] });
    } else {
        // Verificar si el usuario ya ha creado una puntuación para este restaurante
        const puntuacionExistente = puntuacionRestaurante.puntuaciones.find(p => p.usuario_id.toString() === usuario_id);
        if (puntuacionExistente) {
            throw new Error('El usuario ya ha puntuado este restaurante.');
        }
    }

    // Crear la nueva puntuación individual
    const nuevaPuntuacion = { usuario_id, calificacion, puntuacion, comentario };

    // Agregar la nueva puntuación individual al array de puntuaciones
    puntuacionRestaurante.puntuaciones.push(nuevaPuntuacion);

    // Calcular el nuevo ranking promedio
    const totalPuntuaciones = puntuacionRestaurante.puntuaciones.length;
    const sumaPuntuaciones = puntuacionRestaurante.puntuaciones.reduce((acc, curr) => acc + curr.puntuacion, 0);
    const rankingPromedio = sumaPuntuaciones / totalPuntuaciones;
    puntuacionRestaurante.ranking = rankingPromedio;

    // Guardar el documento actualizado
    await puntuacionRestaurante.save();

    // Devolver el registro completo actualizado con la cantidad de registros y la interpretación del ranking
    return {
        ...puntuacionRestaurante.toObject(),
        cantidadPuntuaciones: totalPuntuaciones,
        interpretacionRanking: interpretarRanking(rankingPromedio)
    };
});


//Obtener Puntuaciones
const obtenerPuntuaciones = handleError(async () => {
    const puntuaciones = await Puntuacion.aggregate([
        { $unwind: '$puntuaciones' }, // Desenrollar el array de puntuaciones para tener un documento por cada puntuación
        { $sort: { 'id_restaurante': 1, 'puntuaciones.fecha': 1 } }, // Ordenar los documentos por id_restaurante y luego por la fecha de las puntuaciones
        { $lookup: {
            from: 'usuarios', // Especificar la colección de usuarios para hacer el join
            localField: 'puntuaciones.usuario_id', // Campo en la colección actual que se usa para el join
            foreignField: '_id', // Campo en la colección de usuarios que se corresponde con el campo localField
            as: 'usuario_info' // Nombre del campo en el que se almacenará la información de usuario resultante del join
        } },
        { $group: {
            _id: '$_id', // Agrupar los documentos por el campo _id original de los documentos de puntuación
            id_restaurante: { $first: '$id_restaurante' }, // Mantener el campo id_restaurante del primer documento en cada grupo
            puntuaciones: {
                $push: { // Crear un array de puntuaciones en cada grupo
                    fecha: '$puntuaciones.fecha', // Incluir la fecha de la puntuación
                    calificacion: '$puntuaciones.calificacion', // Incluir la calificación
                    comentario: '$puntuaciones.comentario', // Incluir el comentario si existe
                    puntuacion: '$puntuaciones.puntuacion', // Incluir la puntuación numérica
                    usuario: { $arrayElemAt: ['$usuario_info', 0] } // Incluir la información del usuario, tomando el primer (y único) elemento del array resultado del lookup
                }
            },
            total_puntuaciones: { $sum: 1 }, // Contar la cantidad de puntuaciones por restaurante
            ranking_promedio: { $avg: '$puntuaciones.puntuacion' } // Calcular el ranking promedio
        } },
        { $project: {
            _id: 0, // Excluir el campo _id del resultado final
            id_restaurante: 1, // Incluir el campo id_restaurante en el resultado final
            puntuaciones: 1, // Incluir el array de puntuaciones en el resultado final
            total_puntuaciones: 1, // Incluir la cantidad de puntuaciones en el resultado final
            interpretacion_ranking: {
                $switch: {
                    branches: [
                        { case: { $gte: ['$ranking_promedio', 4.5] }, then: 'Excelente' },
                        { case: { $gte: ['$ranking_promedio', 3.5] }, then: 'Bueno' },
                        { case: { $gte: ['$ranking_promedio', 2.5] }, then: 'Regular' },
                        { case: { $gte: ['$ranking_promedio', 1.5] }, then: 'Malo' }
                    ],
                    default: 'Muy Malo'
                }
            }
        } }
    ]);

    return puntuaciones;
});

// Obtener Puntuación por ID (con información de usuario)
const obtenerPuntuacionPorId = handleError(async (id) => {
    return await Puntuacion.findById(id).populate('puntuaciones.usuario_id', 'nombre email');
});

//Actualizar Puntuacion
const actualizarPuntuacion = handleError(async (id_restaurante, usuario_id, data) => {
    const { calificacion, comentario, puntuacion } = data;

    const puntuacionRestaurante = await Puntuacion.findOne({ id_restaurante });

    if (!puntuacionRestaurante) {
        throw new Error('Puntuación no encontrada');
    }

    const puntuacionIndividual = puntuacionRestaurante.puntuaciones.find(p => p.usuario_id.toString() === usuario_id);

    if (!puntuacionIndividual) {
        throw new Error('Este usuario no ha puntuado este restaurante');
    }

    if (calificacion) puntuacionIndividual.calificacion = calificacion;
    if (comentario) puntuacionIndividual.comentario = comentario;
    if (puntuacion) puntuacionIndividual.puntuacion = puntuacion;

    const totalPuntuaciones = puntuacionRestaurante.puntuaciones.length;
    const sumaPuntuaciones = puntuacionRestaurante.puntuaciones.reduce((acc, curr) => acc + curr.puntuacion, 0);
    const rankingPromedio = sumaPuntuaciones / totalPuntuaciones;
    puntuacionRestaurante.ranking = rankingPromedio;

    await puntuacionRestaurante.save();

    return {
        ...puntuacionIndividual.toObject(),
        interpretacionRanking: interpretarRanking(rankingPromedio)
    };
});

// Eliminar Puntuación
const eliminarPuntuacion = handleError(async (id_puntuacion, usuario_id) => {
    // Buscar la puntuación individual por su ID dentro del documento general de puntuaciones
    const puntuacionRestaurante = await Puntuacion.findOne({ 'puntuaciones._id': id_puntuacion });

    if (!puntuacionRestaurante) {
        throw new Error('Puntuación no encontrada');
    }

    // Encontrar la puntuación individual del usuario por su ID
    const puntuacionIndividual = puntuacionRestaurante.puntuaciones.find(p => p._id.toString() === id_puntuacion && p.usuario_id.toString() === usuario_id);

    if (!puntuacionIndividual) {
        throw new Error('La puntuación especificada no existe para este usuario en este restaurante');
    }

    // Eliminar la puntuación individual del usuario
    puntuacionRestaurante.puntuaciones = puntuacionRestaurante.puntuaciones.filter(p => p._id.toString() !== id_puntuacion);

    // Guardar el documento actualizado
    await puntuacionRestaurante.save();

    return { message: 'Puntuación eliminada exitosamente' };
});

module.exports = {
    crearPuntuacion,
    obtenerPuntuaciones, 
    obtenerPuntuacionPorId,
    actualizarPuntuacion,
    eliminarPuntuacion
};
