const jwt = require('jsonwebtoken');

const accessTokenLifetime = '1h';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || Buffer.byteLength(secret, 'utf8') < 32) {
    throw new Error('JWT_SECRET es obligatoria y debe tener al menos 32 caracteres');
  }

  return secret;
}

function createAccessToken(usuario) {
  return jwt.sign(
    { sub: String(usuario.id) },
    getJwtSecret(),
    { expiresIn: accessTokenLifetime }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, getJwtSecret());
}

module.exports = {
  accessTokenLifetime,
  createAccessToken,
  getJwtSecret,
  verifyAccessToken
};
