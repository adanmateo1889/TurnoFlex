const express = require('express');
const { consultarAsistente } = require('../controllers/asistente.controller');
const autenticarUsuario = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', autenticarUsuario, consultarAsistente);

module.exports = router;
