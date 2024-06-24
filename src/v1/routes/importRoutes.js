//v1/routes/importRoutes.js

const express = require('express');
const router = express.Router();
const importController = require('../../controllers/importController');

router.post('/import', importController.importData);

module.exports = router;
