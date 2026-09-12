const app = require('./app');

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor TurnoFlex escuchando en el puerto ${PORT}`);
});
