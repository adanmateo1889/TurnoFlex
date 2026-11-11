const Disponibilidad = require('../models/Disponibilidad');
const Profesional = require('../models/Profesional');
const Turno = require('../models/Turno');

function autorizarRoles(...rolesPermitidos) {
  return function (req, res, next) {
    if (!req.usuario) {
      return res.status(401).json({ mensaje: 'Autenticación requerida' });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: 'No tiene permisos para realizar esta operación' });
    }

    next();
  };
}

function restringirPerfilProfesional(req, res, next) {
  if (req.usuario.rol === 'profesional'
    && Number(req.params.id) !== req.usuario.profesionalId) {
    return res.status(403).json({ mensaje: 'No puede acceder a otro profesional' });
  }

  next();
}

function restringirListadoProfesionales(req, res, next) {
  if (req.usuario.rol === 'profesional') {
    req.profesionalIdAutorizado = req.usuario.profesionalId;
  }

  next();
}

function restringirPerfilCliente(req, res, next) {
  if (req.usuario.rol === 'cliente'
    && Number(req.params.id) !== req.usuario.clienteId) {
    return res.status(403).json({ mensaje: 'No puede acceder a otro cliente' });
  }

  next();
}

function restringirConsultaDisponibilidades(req, res, next) {
  if (req.usuario.rol !== 'profesional') {
    return next();
  }

  const profesionalId = req.query.profesionalId === undefined
    ? req.usuario.profesionalId
    : Number(req.query.profesionalId);

  if (profesionalId !== req.usuario.profesionalId) {
    return res.status(403).json({ mensaje: 'No puede consultar disponibilidades de otro profesional' });
  }

  req.profesionalIdAutorizado = req.usuario.profesionalId;
  next();
}

function restringirProfesionalDeDisponibilidad(req, res, next) {
  if (req.usuario.rol !== 'profesional') {
    return next();
  }

  if (!req.body) {
    return next();
  }

  if (req.body.profesionalId !== req.usuario.profesionalId) {
    return res.status(403).json({ mensaje: 'No puede operar disponibilidades de otro profesional' });
  }

  next();
}

async function verificarPropiedadDisponibilidad(req, res, next) {
  if (req.usuario.rol !== 'profesional') {
    return next();
  }

  const disponibilidad = await Disponibilidad.findOne({
    id: Number(req.params.id)
  }).select('profesionalId -_id').lean();

  if (disponibilidad
    && disponibilidad.profesionalId !== req.usuario.profesionalId) {
    return res.status(403).json({ mensaje: 'No puede operar disponibilidades de otro profesional' });
  }

  next();
}

function restringirCreacionTurno(req, res, next) {
  if (req.usuario.rol !== 'cliente') {
    return next();
  }

  if (!req.body) {
    return next();
  }

  if (req.body.clienteId !== undefined
    && req.body.clienteId !== req.usuario.clienteId) {
    return res.status(403).json({ mensaje: 'No puede reservar turnos para otro cliente' });
  }

  req.body.clienteId = req.usuario.clienteId;
  next();
}

function restringirConsultaTurnos(req, res, next) {
  if (req.usuario.rol === 'cliente') {
    const clienteId = req.query.clienteId === undefined
      ? req.usuario.clienteId
      : Number(req.query.clienteId);

    if (clienteId !== req.usuario.clienteId) {
      return res.status(403).json({ mensaje: 'No puede consultar turnos de otro cliente' });
    }

    req.turnoScope = { clienteId: req.usuario.clienteId };
  } else if (req.usuario.rol === 'profesional') {
    const profesionalId = req.query.profesionalId === undefined
      ? req.usuario.profesionalId
      : Number(req.query.profesionalId);

    if (profesionalId !== req.usuario.profesionalId) {
      return res.status(403).json({ mensaje: 'No puede consultar turnos de otro profesional' });
    }

    req.turnoScope = { profesionalId: req.usuario.profesionalId };
  }

  next();
}

async function verificarPropiedadTurno(req, res, next) {
  if (req.usuario.rol !== 'cliente' && req.usuario.rol !== 'profesional') {
    return next();
  }

  const turno = await Turno.findOne({ id: Number(req.params.id) })
    .select('clienteId profesionalId -_id')
    .lean();

  if (!turno) {
    return next();
  }

  const propio = req.usuario.rol === 'cliente'
    ? turno.clienteId === req.usuario.clienteId
    : turno.profesionalId === req.usuario.profesionalId;

  if (!propio) {
    return res.status(403).json({ mensaje: 'No puede operar turnos de otro usuario' });
  }

  next();
}

module.exports = {
  autorizarRoles,
  restringirPerfilProfesional,
  restringirListadoProfesionales,
  restringirPerfilCliente,
  restringirConsultaDisponibilidades,
  restringirProfesionalDeDisponibilidad,
  verificarPropiedadDisponibilidad,
  restringirCreacionTurno,
  restringirConsultaTurnos,
  verificarPropiedadTurno
};
