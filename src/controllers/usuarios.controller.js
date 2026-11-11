const Cliente = require('../models/Cliente');
const Profesional = require('../models/Profesional');
const Usuario = require('../models/Usuario');
const { hashPassword } = require('../utils/password');

const rolesPermitidos = ['recepcionista', 'profesional', 'cliente'];

function datosValidos(body) {
  if (!body
    || typeof body.email !== 'string'
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())
    || typeof body.password !== 'string'
    || body.password.length < 8
    || !rolesPermitidos.includes(body.rol)) {
    return false;
  }

  if (body.rol === 'profesional') {
    return Number.isInteger(body.profesionalId) && body.profesionalId > 0;
  }

  if (body.rol === 'cliente') {
    return Number.isInteger(body.clienteId) && body.clienteId > 0;
  }

  return body.profesionalId === undefined && body.clienteId === undefined;
}

async function listarUsuarios(req, res) {
  const usuarios = await Usuario.find()
    .select('-_id id email rol activo profesionalId clienteId')
    .lean();
  res.status(200).json(usuarios);
}

async function crearUsuario(req, res) {
  if (!datosValidos(req.body)) {
    return res.status(400).json({
      mensaje: 'email válido, password de al menos 8 caracteres y un rol permitido son obligatorios'
    });
  }

  const email = req.body.email.trim().toLowerCase();
  if (await Usuario.exists({ email })) {
    return res.status(409).json({ mensaje: 'El email ya está registrado' });
  }

  if (req.body.rol === 'cliente') {
    if (!await Cliente.exists({ id: req.body.clienteId })) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    if (await Usuario.exists({ clienteId: req.body.clienteId })) {
      return res.status(409).json({ mensaje: 'El cliente ya tiene un usuario asociado' });
    }
  }

  if (req.body.rol === 'profesional') {
    if (!await Profesional.exists({ id: req.body.profesionalId })) {
      return res.status(404).json({ mensaje: 'Profesional no encontrado' });
    }
    if (await Usuario.exists({ profesionalId: req.body.profesionalId })) {
      return res.status(409).json({ mensaje: 'El profesional ya tiene un usuario asociado' });
    }
  }

  const ultimoUsuario = await Usuario.findOne()
    .sort({ id: -1 })
    .select('id -_id')
    .lean();
  const datosUsuario = {
    id: ultimoUsuario ? ultimoUsuario.id + 1 : 1,
    email,
    passwordHash: await hashPassword(req.body.password),
    rol: req.body.rol,
    activo: true
  };

  if (req.body.rol === 'cliente') {
    datosUsuario.clienteId = req.body.clienteId;
  } else if (req.body.rol === 'profesional') {
    datosUsuario.profesionalId = req.body.profesionalId;
  }

  try {
    const usuario = await Usuario.create(datosUsuario);
    res.status(201).json(usuario);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        mensaje: 'El email o la relación con el recurso ya está registrada'
      });
    }
    throw error;
  }
}

async function cambiarEstadoUsuario(req, res) {
  if (!req.body || typeof req.body.activo !== 'boolean') {
    return res.status(400).json({ mensaje: 'activo debe ser un valor booleano' });
  }

  const usuario = await Usuario.findOneAndUpdate(
    { id: Number(req.params.id) },
    { $set: { activo: req.body.activo } },
    { returnDocument: 'after' }
  ).select('-_id id email rol activo profesionalId clienteId');

  if (!usuario) {
    return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }

  res.status(200).json(usuario);
}

module.exports = {
  listarUsuarios,
  crearUsuario,
  cambiarEstadoUsuario
};
