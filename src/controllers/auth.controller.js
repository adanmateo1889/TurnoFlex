const Usuario = require('../models/Usuario');
const { verifyPassword } = require('../utils/password');
const { accessTokenLifetime, createAccessToken } = require('../utils/jwt');

async function iniciarSesion(req, res) {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || email.trim() === ''
    || typeof password !== 'string' || password === '') {
    return res.status(400).json({
      mensaje: 'email y password son obligatorios'
    });
  }

  const usuario = await Usuario.findOne({
    email: email.trim().toLowerCase()
  }).select('+passwordHash id email rol activo profesionalId clienteId');

  if (!usuario || !usuario.activo
    || !await verifyPassword(password, usuario.passwordHash)) {
    return res.status(401).json({ mensaje: 'Credenciales inválidas' });
  }

  res.status(200).json({
    token: createAccessToken(usuario),
    tipo: 'Bearer',
    expiraEn: accessTokenLifetime
  });
}

function obtenerSesion(req, res) {
  const { id, email, rol } = req.usuario;
  res.status(200).json({ id, email, rol });
}

module.exports = {
  iniciarSesion,
  obtenerSesion
};
