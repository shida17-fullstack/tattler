const Restaurante = require('../models/restauranteModel');
const UsuarioModel = require('../models/usuarioModel');
const { handleError } = require('../utils/errorHandler');
const moment = require('moment-timezone');

// Crear Restaurante
const crearRestaurante = handleError(async (data) => {
    validarRestauranteData(data);
    const restauranteExistente = await Restaurante.findOne({
        nombre: data.nombre,
        'direccion.calle': data.direccion.calle,
        'direccion.codigo_postal': data.direccion.codigo_postal,
        barrio: data.barrio
    });

    if (restauranteExistente) {
        throw new Error('El restaurante ya existe');
    }

    const restaurante = new Restaurante(data);
    return await restaurante.save();
});

// Obtener Restaurantes y Total de Registros usando Indices
const obtenerRestaurantes = handleError(async () => {
    const totalRegistros = await Restaurante.countDocuments();
    const restaurantes = await Restaurante.find().sort({ nombre: 1, barrio: 1 });
    const explainResult = await Restaurante.find().sort({ nombre: 1, barrio: 1 }).explain();
    console.log(JSON.stringify(explainResult, null, 2));
    return { totalRegistros, restaurantes };
});

// Obtener Restaurante por Id
const obtenerRestaurantePorId = handleError(async (id) => {
    const restaurante = await Restaurante.findById(id);
    if (!restaurante) {
        throw new Error('Restaurante no encontrado');
    }
    const abierto = estaAbierto(restaurante);
    const estado = abierto ? 'En este momento se encuentra abierto.' : 'En este momento se encuentra cerrado.';
    return { restaurante, estado };
});

// Actualizar Restaurante
const actualizarRestaurante = handleError(async (id, data) => {
    const restauranteActual = await Restaurante.findById(id);
    if (!restauranteActual) {
        throw new Error('Restaurante no encontrado');
    }
    const datosNoHanCambiado = Object.keys(data).every(key => {
        return JSON.stringify(data[key]) === JSON.stringify(restauranteActual[key]);
    });

    if (datosNoHanCambiado) {
        const abierto = estaAbierto(restauranteActual);
        return { noCambio: true, restaurante: restauranteActual, abierto };
    }

    const restauranteActualizado = await Restaurante.findByIdAndUpdate(id, data, { new: true });
    const abierto = estaAbierto(restauranteActualizado);
    return { noCambio: false, restaurante: restauranteActualizado, abierto };
});

// Eliminar Restaurante
const eliminarRestaurante = handleError(async (id) => {
    const restauranteEliminado = await Restaurante.findByIdAndDelete(id);
    if (restauranteEliminado) {
        return restauranteEliminado;
    } else {
        throw new Error('Restaurante no encontrado');
    }
});

//Buscar Restaurantes
const buscarRestaurantes = async (usuarioId, nombre, cocina) => {
    const usuario = await UsuarioModel.findById(usuarioId);
    if (!usuario || !usuario.direccion || !usuario.direccion.coordenadas) {
        throw new Error('Usuario no encontrado o no tiene coordenadas registradas.');
    }

    const usuarioCoordenadas = usuario.direccion.coordenadas;
    let query = {};

    if (nombre) {
        query.nombre = { $regex: new RegExp(`.*${nombre}.*`, 'i') };
    }

    if (cocina) {
        query.cocina = { $regex: new RegExp(`.*${cocina}.*`, 'i') };
    }

    const restaurantes = await Restaurante.find(query);
    console.log('Restaurantes encontrados:', restaurantes.length);

    const calcularDistanciaYEstado = (restaurante) => {
        const abierto = estaAbierto(restaurante);
        const [lng, lat] = restaurante.direccion.coordenadas;
        const { distanciaMetros, distanciaKm } = calcularDistancia(usuarioCoordenadas[1], usuarioCoordenadas[0], lat, lng);

        console.log(`Restaurante ${restaurante.nombre} está ${abierto ? 'abierto' : 'cerrado'}. Distancia: ${distanciaKm.toFixed(2)} kilómetros.`);

        return {
            ...restaurante.toObject(),
            estado: abierto ? 'En este momento se encuentra abierto.' : 'En este momento se encuentra cerrado.',
            distancia: distanciaKm,
            distanciaMetros
        };
    };

    const restaurantesConEstadoYDistancia = restaurantes.map(calcularDistanciaYEstado);

    const uniqueRestaurantesMap = new Map();
    restaurantesConEstadoYDistancia.forEach(restaurante => {
        uniqueRestaurantesMap.set(restaurante._id.toString(), restaurante);
    });

    const uniqueRestaurantes = Array.from(uniqueRestaurantesMap.values());
    const restaurantesDentro5km = uniqueRestaurantes.filter(restaurante => restaurante.distancia <= 5);
    const restaurantesOrdenadosDentro5km = restaurantesDentro5km.sort((a, b) => a.distancia - b.distancia);

    if (restaurantesOrdenadosDentro5km.length > 0) {
        return {
            restaurantes: restaurantesOrdenadosDentro5km.map(restaurante => ({
                ...restaurante,
                distancia: `${restaurante.distancia.toFixed(2)} kilómetros`
            })),
            mensaje: `Se encontraron ${restaurantesOrdenadosDentro5km.length} restaurantes dentro de los 5 km.`
        };
    }

    const coincidenciasNombre = uniqueRestaurantes.filter(restaurante =>
        restaurante.nombre.toLowerCase().includes(nombre ? nombre.toLowerCase() : "")
    );
    const coincidenciasCocina = uniqueRestaurantes.filter(restaurante =>
        restaurante.cocina.toLowerCase().includes(cocina ? cocina.toLowerCase() : "")
    );

    const coincidenciasOrdenadas = [...new Map([...coincidenciasNombre, ...coincidenciasCocina].map(r => [r._id, r])).values()]
        .sort((a, b) => a.distancia - b.distancia);

    let mensaje = 'No se encontraron restaurantes dentro de los 5 km.';

    if (coincidenciasNombre.length > 0 && coincidenciasCocina.length > 0) {
        const nombresUnicos = new Set([...coincidenciasNombre.map(r => r.nombre), ...coincidenciasCocina.map(r => r.nombre)]);
        mensaje = `Se encontraron restaurantes que coinciden con el nombre o tipo de cocina: ${Array.from(nombresUnicos).join(', ')}.`;
    } else if (coincidenciasNombre.length > 0) {
        mensaje = `Se encontraron restaurantes que coinciden con el nombre: ${coincidenciasNombre.map(r => r.nombre).join(', ')}.`;
    } else if (coincidenciasCocina.length > 0) {
        mensaje = `Se encontraron restaurantes que coinciden con el tipo de cocina: ${coincidenciasCocina.map(r => r.nombre).join(', ')}.`;
    }

    return {
        restaurantes: coincidenciasOrdenadas.map(restaurante => ({
            ...restaurante,
            distancia: `${restaurante.distancia.toFixed(2)} kilómetros`
        })),
        mensaje
    };
};

//Calcular Distancia
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const radianesLat1 = lat1 * (Math.PI / 180);
    const radianesLat2 = lat2 * (Math.PI / 180);
    const deltaLat = (lat2 - lat1) * (Math.PI / 180);
    const deltaLon = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(deltaLat / 2) ** 2 +
        Math.cos(radianesLat1) * Math.cos(radianesLat2) *
        Math.sin(deltaLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanciaMetros = R * c;
    const distanciaKm = distanciaMetros / 1000;

    return {
        distanciaMetros,
        distanciaKm
    };
}

//Esta Abierto
const estaAbierto = (restaurante) => {
    const ahora = moment().tz(restaurante.zona_horaria);
    let diaSemana = ahora.format('dddd').toLowerCase();

    const diaMap = {
        'monday': 'lunes',
        'tuesday': 'martes',
        'wednesday': 'miercoles',
        'thursday': 'jueves',
        'friday': 'viernes',
        'saturday': 'sabado',
        'sunday': 'domingo'
    };

    diaSemana = diaMap[diaSemana] || diaSemana;

    const horaActual = ahora.format('HH:mm');
    const horarioDia = restaurante.horario[diaSemana];

    if (!horarioDia || !horarioDia.apertura || !horarioDia.cierre) {
        console.log(`Restaurante ${restaurante.nombre} no tiene horario definido para ${diaSemana}.`);
        return false;
    }

    console.log(`Restaurante: ${restaurante.nombre}`);
    console.log(`Horario de apertura: ${horarioDia.apertura}`);
    console.log(`Horario de cierre: ${horarioDia.cierre}`);
    console.log(`Hora actual: ${horaActual}`);

    const horaActualMoment = moment(horaActual, 'HH:mm');
    const aperturaMoment = moment(horarioDia.apertura, 'HH:mm');
    const cierreMoment = moment(horarioDia.cierre, 'HH:mm');

    return horaActualMoment.isBetween(aperturaMoment, cierreMoment, null, '[)');
};


module.exports = {
    crearRestaurante,
    obtenerRestaurantes,
    obtenerRestaurantePorId,
    actualizarRestaurante,
    eliminarRestaurante,
    buscarRestaurantes,
    estaAbierto
};
