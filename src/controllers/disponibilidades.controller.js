const { readDatabase, writeDatabase } = require('../utils/jsonFile');
const Disponibilidad = require('../models/Disponibilidad');

function datosValidos(body, esCreacion) {
  if (!body) {
    return false;
  }

  const disponibleValido = esCreacion && body.disponible === undefined
    ? true
    : typeof body.disponible === 'boolean';

  return Number.isInteger(body.profesionalId)
    && body.profesionalId > 0
    && typeof body.fecha === 'string'
    && /^\d{4}-\d{2}-\d{2}$/.test(body.fecha)
    && body.fecha.trim() !== ''
    && typeof body.hora === 'string'
    && /^\d{2}:\d{2}$/.test(body.hora)
    && body.hora.trim() !== ''
    && disponibleValido;
}

function disponibilidadRepetida(disponibilidades, disponibilidad, id) {
  return disponibilidades.some((item) => (
    item.id !== id
    && item.profesionalId === disponibilidad.profesionalId
    && item.fecha === disponibilidad.fecha
    && item.hora === disponibilidad.hora
  ));
}

function filtrosValidos(query) {
  if (query.profesionalId !== undefined
    && (!/^\d+$/.test(query.profesionalId)
      || !Number.isInteger(Number(query.profesionalId))
      || Number(query.profesionalId) <= 0)) {
    return false;
  }

  if (query.disponible !== undefined
    && query.disponible !== 'true'
    && query.disponible !== 'false') {
    return false;
  }

  return query.fecha === undefined
    || (/^\d{4}-\d{2}-\d{2}$/.test(query.fecha) && query.fecha.trim() !== '');
}

async function listarDisponibilidades(req, res) {
  if (!filtrosValidos(req.query)) {
    return res.status(400).json({ mensaje: 'Filtros incorrectos' });
  }

  const database = await readDatabase();
  const disponibilidades = database.disponibilidades.filter((item) => {
    const profesionalCoincide = req.query.profesionalId === undefined
      || item.profesionalId === Number(req.query.profesionalId);
    const fechaCoincide = req.query.fecha === undefined
      || item.fecha === req.query.fecha;
    const disponibleCoincide = req.query.disponible === undefined
      || item.disponible === (req.query.disponible === 'true');

    return profesionalCoincide && fechaCoincide && disponibleCoincide;
  });

  res.status(200).json(disponibilidades);
}

async function obtenerDisponibilidad(req, res) {
  const database = await readDatabase();
  const disponibilidad = database.disponibilidades.find(
    (item) => item.id === Number(req.params.id)
  );

  if (!disponibilidad) {
    return res.status(404).json({ mensaje: 'Disponibilidad no encontrada' });
  }

  res.status(200).json(disponibilidad);
}

async function crearDisponibilidad(req, res) {
  if (!datosValidos(req.body, true)) {
    return res.status(400).json({
      mensaje: 'profesionalId, fecha y hora son obligatorios y deben tener un formato valido'
    });
  }

  const database = await readDatabase();
  const profesional = database.profesionales.find(
    (item) => item.id === req.body.profesionalId
  );

  if (!profesional) {
    return res.status(404).json({ mensaje: 'Profesional no encontrado' });
  }

  const disponibilidad = new Disponibilidad(
    database.disponibilidades.reduce(
      (maxId, item) => Math.max(maxId, item.id),
      0
    ) + 1,
    req.body.profesionalId,
    req.body.fecha.trim(),
    req.body.hora.trim(),
    req.body.disponible === undefined ? true : req.body.disponible
  );

  if (disponibilidadRepetida(database.disponibilidades, disponibilidad)) {
    return res.status(409).json({ mensaje: 'La disponibilidad ya existe' });
  }

  database.disponibilidades.push(disponibilidad);
  await writeDatabase(database);

  res.status(201).json(disponibilidad);
}

async function modificarDisponibilidad(req, res) {
  if (!datosValidos(req.body, false)) {
    return res.status(400).json({
      mensaje: 'profesionalId, fecha, hora y disponible son obligatorios y deben tener un formato valido'
    });
  }

  const database = await readDatabase();
  const indice = database.disponibilidades.findIndex(
    (item) => item.id === Number(req.params.id)
  );

  if (indice === -1) {
    return res.status(404).json({ mensaje: 'Disponibilidad no encontrada' });
  }

  const profesional = database.profesionales.find(
    (item) => item.id === req.body.profesionalId
  );

  if (!profesional) {
    return res.status(404).json({ mensaje: 'Profesional no encontrado' });
  }

  const disponibilidad = {
    id: database.disponibilidades[indice].id,
    profesionalId: req.body.profesionalId,
    fecha: req.body.fecha.trim(),
    hora: req.body.hora.trim(),
    disponible: req.body.disponible
  };

  if (disponibilidadRepetida(database.disponibilidades, disponibilidad, disponibilidad.id)) {
    return res.status(409).json({ mensaje: 'La disponibilidad ya existe' });
  }

  database.disponibilidades[indice] = disponibilidad;
  await writeDatabase(database);

  res.status(200).json(disponibilidad);
}

async function eliminarDisponibilidad(req, res) {
  const database = await readDatabase();
  const indice = database.disponibilidades.findIndex(
    (item) => item.id === Number(req.params.id)
  );

  if (indice === -1) {
    return res.status(404).json({ mensaje: 'Disponibilidad no encontrada' });
  }

  database.disponibilidades.splice(indice, 1);
  await writeDatabase(database);

  res.status(204).send();
}

module.exports = {
  listarDisponibilidades,
  obtenerDisponibilidad,
  crearDisponibilidad,
  modificarDisponibilidad,
  eliminarDisponibilidad
};
