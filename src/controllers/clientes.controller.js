const { readDatabase, writeDatabase } = require('../utils/jsonFile');
const Cliente = require('../models/Cliente');

function datosValidos(body) {
  return body
    && typeof body.nombre === 'string'
    && body.nombre.trim() !== ''
    && typeof body.apellido === 'string'
    && body.apellido.trim() !== '';
}

async function listarClientes(req, res) {
  const database = await readDatabase();
  res.status(200).json(database.clientes);
}

async function obtenerCliente(req, res) {
  const database = await readDatabase();
  const cliente = database.clientes.find(
    (item) => item.id === Number(req.params.id)
  );

  if (!cliente) {
    return res.status(404).json({ mensaje: 'Cliente no encontrado' });
  }

  res.status(200).json(cliente);
}

async function crearCliente(req, res) {
  if (!datosValidos(req.body)) {
    return res.status(400).json({
      mensaje: 'nombre y apellido son obligatorios y deben ser strings no vacios'
    });
  }

  const database = await readDatabase();
  const ultimoId = database.clientes.reduce(
    (maxId, cliente) => Math.max(maxId, cliente.id),
    0
  );
  const cliente = new Cliente(
    ultimoId + 1,
    req.body.nombre.trim(),
    req.body.apellido.trim()
  );

  database.clientes.push(cliente);
  await writeDatabase(database);

  res.status(201).json(cliente);
}

async function modificarCliente(req, res) {
  if (!datosValidos(req.body)) {
    return res.status(400).json({
      mensaje: 'nombre y apellido son obligatorios y deben ser strings no vacios'
    });
  }

  const database = await readDatabase();
  const indice = database.clientes.findIndex(
    (item) => item.id === Number(req.params.id)
  );

  if (indice === -1) {
    return res.status(404).json({ mensaje: 'Cliente no encontrado' });
  }

  const cliente = {
    id: database.clientes[indice].id,
    nombre: req.body.nombre.trim(),
    apellido: req.body.apellido.trim()
  };

  database.clientes[indice] = cliente;
  await writeDatabase(database);

  res.status(200).json(cliente);
}

async function eliminarCliente(req, res) {
  const database = await readDatabase();
  const indice = database.clientes.findIndex(
    (item) => item.id === Number(req.params.id)
  );

  if (indice === -1) {
    return res.status(404).json({ mensaje: 'Cliente no encontrado' });
  }

  database.clientes.splice(indice, 1);
  await writeDatabase(database);

  res.status(204).send();
}

module.exports = {
  listarClientes,
  obtenerCliente,
  crearCliente,
  modificarCliente,
  eliminarCliente
};
