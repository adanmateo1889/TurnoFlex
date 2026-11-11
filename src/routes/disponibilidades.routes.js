const express = require('express');
const {
  listarDisponibilidades,
  obtenerDisponibilidad,
  crearDisponibilidad,
  modificarDisponibilidad,
  eliminarDisponibilidad
} = require('../controllers/disponibilidades.controller');
const autenticarUsuario = require('../middlewares/auth.middleware');
const {
  autorizarRoles,
  restringirConsultaDisponibilidades,
  restringirProfesionalDeDisponibilidad,
  verificarPropiedadDisponibilidad
} = require('../middlewares/authorization.middleware');

const router = express.Router();

router.get(
  '/',
  autenticarUsuario,
  autorizarRoles('coordinador', 'recepcionista', 'profesional', 'cliente'),
  restringirConsultaDisponibilidades,
  listarDisponibilidades
);
router.get(
  '/:id',
  autenticarUsuario,
  autorizarRoles('coordinador', 'recepcionista', 'profesional', 'cliente'),
  verificarPropiedadDisponibilidad,
  obtenerDisponibilidad
);
router.post(
  '/',
  autenticarUsuario,
  autorizarRoles('coordinador', 'profesional'),
  restringirProfesionalDeDisponibilidad,
  crearDisponibilidad
);
router.put(
  '/:id',
  autenticarUsuario,
  autorizarRoles('coordinador', 'profesional'),
  restringirProfesionalDeDisponibilidad,
  verificarPropiedadDisponibilidad,
  modificarDisponibilidad
);
router.delete(
  '/:id',
  autenticarUsuario,
  autorizarRoles('coordinador', 'profesional'),
  verificarPropiedadDisponibilidad,
  eliminarDisponibilidad
);

module.exports = router;
