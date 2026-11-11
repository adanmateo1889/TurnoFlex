const express = require('express');
const {
  listarClientes,
  obtenerCliente,
  crearCliente,
  modificarCliente,
  eliminarCliente
} = require('../controllers/clientes.controller');
const autenticarUsuario = require('../middlewares/auth.middleware');
const {
  autorizarRoles,
  restringirPerfilCliente
} = require('../middlewares/authorization.middleware');

const router = express.Router();

router.get(
  '/',
  autenticarUsuario,
  autorizarRoles('coordinador', 'recepcionista'),
  listarClientes
);
router.get(
  '/:id',
  autenticarUsuario,
  autorizarRoles('coordinador', 'recepcionista', 'cliente'),
  restringirPerfilCliente,
  obtenerCliente
);
router.post(
  '/',
  autenticarUsuario,
  autorizarRoles('coordinador', 'recepcionista'),
  crearCliente
);
router.put(
  '/:id',
  autenticarUsuario,
  autorizarRoles('coordinador', 'recepcionista'),
  modificarCliente
);
router.delete(
  '/:id',
  autenticarUsuario,
  autorizarRoles('coordinador', 'recepcionista'),
  eliminarCliente
);

module.exports = router;
