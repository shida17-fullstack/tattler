const importService = require('../services/importService.js');

const importData = async (req, res) => {
    try {
        const result = await importService.importData();
        
        const usuariosMessage = result.usuariosMessage || 'No se importaron usuarios';
        const restaurantesMessage = result.restaurantesMessage || 'No se importaron restaurantes';
        const puntuacionesMessage = result.puntuacionesMessage ? result.puntuacionesMessage.replace(/\n/g, '\n') : 'No se importaron puntuaciones';
        
        const responseMessage = `
            ${usuariosMessage}
            
            ${restaurantesMessage}
            
            ${puntuacionesMessage}
        `.trim();
        
        res.status(200).send(responseMessage);
    } catch (error) {
        res.status(500).send('Error importando datos: ' + error.message);
    }
};

module.exports = {
    importData
};
