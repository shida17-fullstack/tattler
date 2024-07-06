// src/utils/errorHandler.js

// Función para manejar errores de forma genérica
const handleError = (func) => async (...params) => {
    try {
        return await func(...params);
    } catch (error) {
        throw new Error(`Error: ${error.message}`);
    }
};

module.exports = {
    handleError,
};
