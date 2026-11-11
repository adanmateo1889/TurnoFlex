const express = require('express');
const {
  listarProfesionales,
  obtenerProfesional,
  crearProfesional,
  modificarProfesional,
  eliminarProfesional
} = require('../controllers/profesionales.controller');
const autenticarUsuario = require('../middlewares/auth.middleware');
const {
  autorizarRoles,
  restringirPerfilProfesional,
  restringirListadoProfesionales
} = require('../middlewares/authorization.middleware');

const router = express.Router();

router.get(
  '/',
  autenticarUsuario,
  autorizarRoles('coordinador', 'recepcionista', 'profesional', 'cliente'),
  restringirListadoProfesionales,
  listarProfesionales
);
router.get(
  '/:id',
  autenticarUsuario,
  autorizarRoles('coordinador', 'recepcionista', 'profesional', 'cliente'),
  restringirPerfilProfesional,
  obtenerProfesional
);
router.post('/', autenticarUsuario, autorizarRoles('coordinador'), crearProfesional);
router.put('/:id', autenticarUsuario, autorizarRoles('coordinador'), modificarProfesional);
router.delete('/:id', autenticarUsuario, autorizarRoles('coordinador'), eliminarProfesional);

module.exports = router;
