const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    min: 1
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  passwordHash: {
    type: String,
    required: true,
    select: false
  },
  rol: {
    type: String,
    required: true,
    enum: ['coordinador', 'recepcionista', 'profesional', 'cliente']
  },
  activo: {
    type: Boolean,
    default: true,
    required: true
  },
  profesionalId: {
    type: Number,
    min: 1
  },
  clienteId: {
    type: Number,
    min: 1
  }
}, {
  id: false,
  versionKey: false,
  collection: 'usuarios',
  toJSON: {
    transform: (document, returned) => {
      delete returned._id;
      delete returned.passwordHash;
      return returned;
    }
  }
});

usuarioSchema.pre('validate', function () {
  if (this.rol === 'profesional' && !Number.isInteger(this.profesionalId)) {
    this.invalidate('profesionalId', 'El usuario profesional debe tener profesionalId');
  }

  if (this.rol !== 'profesional' && this.profesionalId !== undefined) {
    this.invalidate('profesionalId', 'Solo un usuario profesional puede tener profesionalId');
  }

  if (this.rol === 'cliente' && !Number.isInteger(this.clienteId)) {
    this.invalidate('clienteId', 'El usuario cliente debe tener clienteId');
  }

  if (this.rol !== 'cliente' && this.clienteId !== undefined) {
    this.invalidate('clienteId', 'Solo un usuario cliente puede tener clienteId');
  }
});

usuarioSchema.index(
  { profesionalId: 1 },
  { unique: true, partialFilterExpression: { profesionalId: { $type: 'number' } } }
);

usuarioSchema.index(
  { clienteId: 1 },
  { unique: true, partialFilterExpression: { clienteId: { $type: 'number' } } }
);

module.exports = mongoose.model('Usuario', usuarioSchema);
