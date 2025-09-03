const prisma = require('../../prisma/client');
const { hashPassword, verifyPassword, randomToken, sha256 } = require('../../utils/crypto');
const { signAccessToken } = require('../../utils/jwt');

async function register({ email, password, name }) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error('Email already in use');

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({ data: { email, passwordHash, name } });
  const { accessToken, refreshToken } = await issueTokens(user.id);
  return { user: sanitize(user), accessToken, refreshToken };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) throw new Error('Invalid credentials');

  const { accessToken, refreshToken } = await issueTokens(user.id);
  return { user: sanitize(user), accessToken, refreshToken };
}

async function issueTokens(userId) {
  // access
  const accessToken = signAccessToken({ sub: userId });

  // refresh (opaque random) -> store hash + expiry
  const refreshPlain = randomToken(48);
  const tokenHash = sha256(refreshPlain);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30d

  await prisma.refreshToken.create({
    data: { userId, tokenHash, expiresAt },
  });

  return { accessToken, refreshToken: refreshPlain };
}

async function rotateRefreshToken(userId, provided) {
  const tokenHash = sha256(provided);
  const record = await prisma.refreshToken.findFirst({ where: { userId, tokenHash } });
  if (!record || record.expiresAt < new Date()) throw new Error('Invalid refresh token');

  // delete old, issue new (rotation)
  await prisma.refreshToken.delete({ where: { id: record.id } });
  return issueTokens(userId);
}

async function revokeRefreshToken(userId, provided) {
  const tokenHash = sha256(provided);
  const deletedTokens =  await prisma.refreshToken.deleteMany({ where: { userId, tokenHash } });
  return deletedTokens
}

function sanitize(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

module.exports = { register, login, rotateRefreshToken, revokeRefreshToken };
