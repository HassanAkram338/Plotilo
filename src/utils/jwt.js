const jwt = require('jsonwebtoken');
const config = require('../config');

exports.signAccessToken = (payload) =>
  jwt.sign(payload, config.jwt.accessSecret, { expiresIn: '15m' });

exports.verifyAccessToken = (token) =>
  jwt.verify(token, config.jwt.accessSecret);

exports.signRefreshTokenPlain = (payload) =>
  jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: '30d' });
// we’ll still store an extra random token server-side for rotation safety
