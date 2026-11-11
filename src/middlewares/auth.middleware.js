const Usuario = require('../models/Usuario');
const { verifyAccessToken } = require('../utils/jwt');

function noAutorizado(res) {
  return res.status(401).json({ mensaje: 'Autenticación requerida o token inválido' });
}

async function autenticarUsuario(req, res, next) {
  const authorization = req.get('authorization');
  const match = authorization && authorization.match(/^Bearer\s+(\S+)$/i);
  if (!match) {
    return noAutorizado(res);
  }

  let payload;
  try {
    payload = verifyAccessToken(match[1]);
  } catch (error) {
    if (error.name === 'JsonWebTokenError'
      || error.name === 'TokenExpiredError'
      || error.name === 'NotBeforeError') {
      return noAutorizado(res);
    }
    return next(error);
  }

  if (!payload || typeof payload !== 'object'
    || typeof payload.sub !== 'string'
    || !/^[1-9]\d*$/.test(payload.sub)) {
    return noAutorizado(res);
  }

  const id = Number(payload.sub);
  if (!Number.isSafeInteger(id)) {
    return noAutorizado(res);
  }

  const usuario = await Usuario.findOne({ id, activo: true })
    .select('id email rol activo profesionalId clienteId')
    .lean();

  if (!usuario) {
    return noAutorizado(res);
  }

  req.usuario = usuario;
  next();
}

module.exports = autenticarUsuario;
