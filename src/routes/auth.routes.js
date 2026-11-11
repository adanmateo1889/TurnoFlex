const express = require('express');
const {
  iniciarSesion,
  obtenerSesion
} = require('../controllers/auth.controller');
const {
  listarUsuarios,
  crearUsuario,
  cambiarEstadoUsuario
} = require('../controllers/usuarios.controller');
const autenticarUsuario = require('../middlewares/auth.middleware');
const { autorizarRoles } = require('../middlewares/authorization.middleware');

const router = express.Router();

router.post('/login', iniciarSesion);
router.get('/me', autenticarUsuario, obtenerSesion);
router.get('/usuarios', autenticarUsuario, autorizarRoles('coordinador'), listarUsuarios);
router.post(
  '/usuarios',
  autenticarUsuario,
  autorizarRoles('coordinador'),
  crearUsuario
);
router.patch(
  '/usuarios/:id/activo',
  autenticarUsuario,
  autorizarRoles('coordinador'),
  cambiarEstadoUsuario
);

module.exports = router;
