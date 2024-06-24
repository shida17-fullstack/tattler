const path = require('path');
const fs = require('fs');
const csvParser = require('csv-parser');
const UsuarioModel = require('../models/usuarioModel.js');
const RestauranteModel = require('../models/restauranteModel.js');
const PuntuacionModel = require('../models/puntuacionModel.js');

const importData = async () => {
    try {
        const usuariosMessage = await importUsuarios();
        const restaurantesMessage = await importRestaurantes();
        const puntuacionesMessage = await importPuntuaciones();

        return {
            usuariosMessage,
            restaurantesMessage,
            puntuacionesMessage
        };
    } catch (error) {
        throw new Error('Error importando datos: ' + error.message);
    }
};

const importUsuarios = async () => {
    try {
        const jsonUsuariosFilePath = path.join(__dirname, '../bd/json/usuarios.json');
        const usuariosDataJson = JSON.parse(fs.readFileSync(jsonUsuariosFilePath, 'utf-8'));

        const csvUsuariosFilePath = path.join(__dirname, '../bd/csv/usuarios.csv');
        const usuariosDataCsv = [];

        await new Promise((resolve, reject) => {
            fs.createReadStream(csvUsuariosFilePath)
                .pipe(csvParser())
                .on('data', (row) => {
                    const usuario = {
                        nombre: row.nombre,
                        email: row.email,
                        telefono: row.telefono,
                        direccion: row.direccion
                    };
                    usuariosDataCsv.push(usuario);
                })
                .on('end', resolve)
                .on('error', reject);
        });

        const usuariosData = [...usuariosDataJson, ...usuariosDataCsv];
        const countUsuarios = await UsuarioModel.countDocuments();
        if (countUsuarios === 0) {
            await UsuarioModel.insertMany(usuariosData);
            return 'Datos de usuarios importados exitosamente';
        } else {
            return 'Datos de usuarios ya existentes, no se requiere importación';
        }
    } catch (error) {
        throw new Error('Error importando usuarios: ' + error.message);
    }
};

const importRestaurantes = async () => {
    try {
        const jsonRestauranteFilePath = path.join(__dirname, '../bd/json/restaurantes.json');
        const restaurantesDataJson = JSON.parse(fs.readFileSync(jsonRestauranteFilePath, 'utf-8'));

        const csvRestauranteFilePath = path.join(__dirname, '../bd/csv/restaurantes_nuevos.csv');
        const restaurantesDataCsv = [];

        await new Promise((resolve, reject) => {
            fs.createReadStream(csvRestauranteFilePath)
                .pipe(csvParser())
                .on('data', (row) => {
                    const restaurante = {
                        nombre: row.nombre,
                        direccion: {
                            calle: row.direccion_calle,
                            codigo_postal: row.direccion_codigo_postal,
                            coordenadas: row.direccion_coordenadas.split(',').map(Number)
                        },
                        barrio: row.barrio,
                        cocina: row.cocina
                    };
                    restaurantesDataCsv.push(restaurante);
                })
                .on('end', resolve)
                .on('error', reject);
        });

        const restaurantesData = [...restaurantesDataJson, ...restaurantesDataCsv];
        const countRestaurantes = await RestauranteModel.countDocuments();
        if (countRestaurantes === 0) {
            await RestauranteModel.insertMany(restaurantesData);
            return 'Datos de restaurantes importados exitosamente';
        } else {
            return 'Datos de restaurantes ya existentes, no se requiere importación';
        }
    } catch (error) {
        throw new Error('Error importando restaurantes: ' + error.message);
    }
};

const importPuntuaciones = async () => {
    try {
        const jsonPuntuacionFilePath = path.join(__dirname, '../bd/json/puntuaciones.json');
        const puntuacionesDataJson = JSON.parse(fs.readFileSync(jsonPuntuacionFilePath, 'utf-8'));

        const csvPuntuacionFilePath = path.join(__dirname, '../bd/csv/puntuaciones.csv');
        const puntuacionesDataCsv = [];

        await new Promise((resolve, reject) => {
            fs.createReadStream(csvPuntuacionFilePath)
                .pipe(csvParser())
                .on('data', (row) => {
                    const puntuacion = {
                        id_restaurante: row.id_restaurante,
                        puntuaciones: [{
                            fecha: new Date(row.fecha),
                            calificacion: row.calificacion,
                            comentario: row.comentario,
                            puntuacion: parseInt(row.puntuacion),
                            usuario_id: row.usuario_id
                        }]
                    };
                    puntuacionesDataCsv.push(puntuacion);
                })
                .on('end', resolve)
                .on('error', reject);
        });

        const puntuacionesData = [...puntuacionesDataJson, ...puntuacionesDataCsv];
        const messages = [];

        for (const puntuacion of puntuacionesData) {
            const existingPuntuacion = await PuntuacionModel.findOne({ id_restaurante: puntuacion.id_restaurante, "puntuaciones.fecha": { $in: puntuacion.puntuaciones.map(p => p.fecha) } });
            if (!existingPuntuacion) {
                await PuntuacionModel.create(puntuacion);
                messages.push(`Datos de puntuación para restaurante ID ${puntuacion.id_restaurante} importados exitosamente`);
            } else {
                messages.push(`Datos de puntuación para restaurante ID ${puntuacion.id_restaurante} ya existen, no se requiere importación`);
            }
        }
        messages.push('Proceso de importación de puntuaciones completado');
        return messages.join('\n');
    } catch (error) {
        throw new Error('Error importando puntuaciones: ' + error.message);
    }
};

module.exports = {
    importData
};
