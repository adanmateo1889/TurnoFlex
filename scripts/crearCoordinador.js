require('dotenv').config();

const mongoose = require('mongoose');
const connectDatabase = require('../src/config/database');
const Usuario = require('../src/models/Usuario');
const { hashPassword } = require('../src/utils/password');

async function crearCoordinador() {
  const email = process.env.COORDINADOR_EMAIL;
  const password = process.env.COORDINADOR_PASSWORD;

  if (!email || !password) {
    throw new Error('Definí COORDINADOR_EMAIL y COORDINADOR_PASSWORD para ejecutar este script');
  }

  if (password.length < 8) {
    throw new Error('La contraseña del coordinador debe tener al menos 8 caracteres');
  }

  await connectDatabase();
  await Usuario.init();

  if (await Usuario.exists({ rol: 'coordinador' })) {
    throw new Error('Ya existe un usuario coordinador en esta base de datos');
  }

  const ultimoUsuario = await Usuario.findOne()
    .sort({ id: -1 })
    .select('id -_id')
    .lean();

  const usuario = await Usuario.create({
    id: ultimoUsuario ? ultimoUsuario.id + 1 : 1,
    email,
    passwordHash: await hashPassword(password),
    rol: 'coordinador',
    activo: true
  });

  console.log(`Usuario coordinador creado con id ${usuario.id}`);
}

crearCoordinador()
  .catch((error) => {
    console.error('No se pudo crear el coordinador:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });
