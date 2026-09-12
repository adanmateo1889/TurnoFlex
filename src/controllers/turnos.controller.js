const { readDatabase, writeDatabase } = require('../utils/jsonFile');
const Turno = require('../models/Turno');

const estadosPermitidos = ['reservado', 'cancelado', 'atendido'];

function idsValidos(body) {
  return body
    && Number.isInteger(body.profesionalId)
    && body.profesionalId > 0
    && Number.isInteger(body.clienteId)
    && body.clienteId > 0
    && Number.isInteger(body.disponibilidadId)
    && body.disponibilidadId > 0;
}

function filtrosValidos(query) {
  const idsValidosEnConsulta = ['profesionalId', 'clienteId'].every((campo) => (
    query[campo] === undefined
      || (/^\d+$/.test(query[campo])
        && Number.isInteger(Number(query[campo]))
        && Number(query[campo]) > 0)
  ));

  const fechaValida = query.fecha === undefined
    || (/^\d{4}-\d{2}-\d{2}$/.test(query.fecha) && query.fecha.trim() !== '');
  const estadoValido = query.estado === undefined
    || estadosPermitidos.includes(query.estado);

  return idsValidosEnConsulta && fechaValida && estadoValido;
}

async function listarTurnos(req, res) {
  if (!filtrosValidos(req.query)) {
    return res.status(400).json({ mensaje: 'Filtros incorrectos' });
  }

  const database = await readDatabase();
  const turnos = database.turnos.filter((turno) => {
    const profesionalCoincide = req.query.profesionalId === undefined
      || turno.profesionalId === Number(req.query.profesionalId);
    const clienteCoincide = req.query.clienteId === undefined
      || turno.clienteId === Number(req.query.clienteId);
    const fechaCoincide = req.query.fecha === undefined
      || turno.fecha === req.query.fecha;
    const estadoCoincide = req.query.estado === undefined
      || turno.estado === req.query.estado;

    return profesionalCoincide && clienteCoincide && fechaCoincide && estadoCoincide;
  });

  res.status(200).json(turnos);
}

async function obtenerTurno(req, res) {
  const database = await readDatabase();
  const turno = database.turnos.find((item) => item.id === Number(req.params.id));

  if (!turno) {
    return res.status(404).json({ mensaje: 'Turno no encontrado' });
  }

  res.status(200).json(turno);
}

async function crearTurno(req, res) {
  if (!idsValidos(req.body)) {
    return res.status(400).json({
      mensaje: 'profesionalId, clienteId y disponibilidadId son obligatorios y deben ser numericos'
    });
  }

  const database = await readDatabase();
  const profesional = database.profesionales.find(
    (item) => item.id === req.body.profesionalId
  );
  const cliente = database.clientes.find(
    (item) => item.id === req.body.clienteId
  );
  const disponibilidad = database.disponibilidades.find(
    (item) => item.id === req.body.disponibilidadId
  );

  if (!profesional) {
    return res.status(404).json({ mensaje: 'Profesional no encontrado' });
  }

  if (!cliente) {
    return res.status(404).json({ mensaje: 'Cliente no encontrado' });
  }

  if (!disponibilidad) {
    return res.status(404).json({ mensaje: 'Disponibilidad no encontrada' });
  }

  if (disponibilidad.profesionalId !== req.body.profesionalId) {
    return res.status(409).json({
      mensaje: 'La disponibilidad no pertenece al profesional indicado'
    });
  }

  if (disponibilidad.disponible !== true) {
    return res.status(409).json({ mensaje: 'La disponibilidad no esta disponible' });
  }

  const profesionalTieneTurno = database.turnos.some((turno) => (
    turno.profesionalId === req.body.profesionalId
    && turno.fecha === disponibilidad.fecha
    && turno.hora === disponibilidad.hora
    && turno.estado === 'reservado'
  ));
  const clienteTieneTurno = database.turnos.some((turno) => (
    turno.clienteId === req.body.clienteId
    && turno.fecha === disponibilidad.fecha
    && turno.hora === disponibilidad.hora
    && turno.estado === 'reservado'
  ));

  if (profesionalTieneTurno || clienteTieneTurno) {
    return res.status(409).json({ mensaje: 'El horario ya esta reservado' });
  }

  const turno = new Turno(
    database.turnos.reduce(
      (maxId, item) => Math.max(maxId, item.id),
      0
    ) + 1,
    req.body.profesionalId,
    req.body.clienteId,
    req.body.disponibilidadId,
    disponibilidad.fecha,
    disponibilidad.hora,
    'reservado'
  );

  database.turnos.push(turno);
  disponibilidad.disponible = false;
  await writeDatabase(database);

  res.status(201).json(turno);
}

async function modificarEstadoTurno(req, res) {
  if (!req.body || req.body.estado !== 'atendido') {
    return res.status(400).json({
      mensaje: 'El estado debe ser atendido'
    });
  }

  const database = await readDatabase();
  const turno = database.turnos.find((item) => item.id === Number(req.params.id));

  if (!turno) {
    return res.status(404).json({ mensaje: 'Turno no encontrado' });
  }

  if (turno.estado === 'cancelado' || turno.estado === 'atendido') {
    return res.status(409).json({ mensaje: 'El turno no puede ser atendido' });
  }

  turno.estado = 'atendido';
  await writeDatabase(database);

  res.status(200).json(turno);
}

async function cancelarTurno(req, res) {
  const database = await readDatabase();
  const turno = database.turnos.find((item) => item.id === Number(req.params.id));

  if (!turno) {
    return res.status(404).json({ mensaje: 'Turno no encontrado' });
  }

  if (turno.estado === 'cancelado') {
    return res.status(409).json({ mensaje: 'El turno ya esta cancelado' });
  }

  const disponibilidad = database.disponibilidades.find(
    (item) => item.id === turno.disponibilidadId
  );

  if (!disponibilidad) {
    return res.status(404).json({ mensaje: 'Disponibilidad no encontrada' });
  }

  turno.estado = 'cancelado';
  disponibilidad.disponible = true;
  await writeDatabase(database);

  res.status(200).json(turno);
}

module.exports = {
  listarTurnos,
  obtenerTurno,
  crearTurno,
  modificarEstadoTurno,
  cancelarTurno
};
