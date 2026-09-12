class Disponibilidad {
  constructor(id, profesionalId, fecha, hora, disponible) {
    this.id = id;
    this.profesionalId = profesionalId;
    this.fecha = fecha;
    this.hora = hora;
    this.disponible = disponible;
  }
}

module.exports = Disponibilidad;
