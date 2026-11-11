const express = require('express');
const {
  listarTurnos,
  obtenerTurno,
  crearTurno,
  modificarEstadoTurno,
  cancelarTurno
} = require('../controllers/turnos.controller');
const autenticarUsuario = require('../middlewares/auth.middleware');
const {
  autorizarRoles,
  restringirCreacionTurno,
  restringirConsultaTurnos,
  verificarPropiedadTurno
} = require('../middlewares/authorization.middleware');

const router = express.Router();

router.get(
  '/',
  autenticarUsuario,
  autorizarRoles('coordinador', 'recepcionista', 'profesional', 'cliente'),
  restringirConsultaTurnos,
  listarTurnos
);
router.get(
  '/:id',
  autenticarUsuario,
  autorizarRoles('coordinador', 'recepcionista', 'profesional', 'cliente'),
  verificarPropiedadTurno,
  obtenerTurno
);
router.post(
  '/',
  autenticarUsuario,
  autorizarRoles('coordinador', 'recepcionista', 'cliente'),
  restringirCreacionTurno,
  crearTurno
);
router.put(
  '/:id',
  autenticarUsuario,
  autorizarRoles('coordinador', 'profesional'),
  verificarPropiedadTurno,
  modificarEstadoTurno
);
router.patch(
  '/:id/cancelar',
  autenticarUsuario,
  autorizarRoles('coordinador', 'recepcionista', 'cliente'),
  verificarPropiedadTurno,
  cancelarTurno
);

module.exports = router;
