class Turno {
  constructor(id, profesionalId, clienteId, disponibilidadId, fecha, hora, estado) {
    this.id = id;
    this.profesionalId = profesionalId;
    this.clienteId = clienteId;
    this.disponibilidadId = disponibilidadId;
    this.fecha = fecha;
    this.hora = hora;
    this.estado = estado;
  }
}

module.exports = Turno;
