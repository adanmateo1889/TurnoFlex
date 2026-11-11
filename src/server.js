require('dotenv').config();

const app = require('./app');
const connectDatabase = require('./config/database');
const { getJwtSecret } = require('./utils/jwt');

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  getJwtSecret();
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Servidor TurnoFlex escuchando en el puerto ${PORT}`);
  });
}

iniciarServidor().catch((error) => {
  console.error('No se pudo iniciar TurnoFlex:', error);
  process.exit(1);
});
