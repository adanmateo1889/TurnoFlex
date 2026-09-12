const { readDatabase, writeDatabase } = require('../utils/jsonFile');
const Profesional = require('../models/Profesional');

function datosValidos(body) {
  return body
    && typeof body.nombre === 'string'
    && body.nombre.trim() !== ''
    && typeof body.apellido === 'string'
    && body.apellido.trim() !== '';
}

async function listarProfesionales(req, res) {
  const database = await readDatabase();
  res.status(200).json(database.profesionales);
}

async function obtenerProfesional(req, res) {
  const database = await readDatabase();
  const profesional = database.profesionales.find(
    (item) => item.id === Number(req.params.id)
  );

  if (!profesional) {
    return res.status(404).json({ mensaje: 'Profesional no encontrado' });
  }

  res.status(200).json(profesional);
}

async function crearProfesional(req, res) {
  if (!datosValidos(req.body)) {
    return res.status(400).json({
      mensaje: 'nombre y apellido son obligatorios y deben ser strings no vacios'
    });
  }

  const database = await readDatabase();
  const ultimoId = database.profesionales.reduce(
    (maxId, profesional) => Math.max(maxId, profesional.id),
    0
  );
  const profesional = new Profesional(
    ultimoId + 1,
    req.body.nombre.trim(),
    req.body.apellido.trim()
  );

  database.profesionales.push(profesional);
  await writeDatabase(database);

  res.status(201).json(profesional);
}

async function modificarProfesional(req, res) {
  if (!datosValidos(req.body)) {
    return res.status(400).json({
      mensaje: 'nombre y apellido son obligatorios y deben ser strings no vacios'
    });
  }

  const database = await readDatabase();
  const indice = database.profesionales.findIndex(
    (item) => item.id === Number(req.params.id)
  );

  if (indice === -1) {
    return res.status(404).json({ mensaje: 'Profesional no encontrado' });
  }

  const profesional = {
    id: database.profesionales[indice].id,
    nombre: req.body.nombre.trim(),
    apellido: req.body.apellido.trim()
  };

  database.profesionales[indice] = profesional;
  await writeDatabase(database);

  res.status(200).json(profesional);
}

async function eliminarProfesional(req, res) {
  const database = await readDatabase();
  const indice = database.profesionales.findIndex(
    (item) => item.id === Number(req.params.id)
  );

  if (indice === -1) {
    return res.status(404).json({ mensaje: 'Profesional no encontrado' });
  }

  database.profesionales.splice(indice, 1);
  await writeDatabase(database);

  res.status(204).send();
}

module.exports = {
  listarProfesionales,
  obtenerProfesional,
  crearProfesional,
  modificarProfesional,
  eliminarProfesional
};
