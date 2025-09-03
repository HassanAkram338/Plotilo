const { verifyAccessToken } = require('../utils/jwt');
const prisma = require('../prisma/client');

exports.requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token)
      return res.status(401).json({ success: false, error: 'No token' });

    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub };

    // (optional) fetch user object
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user)
      return res.status(401).json({ success: false, error: 'User not found' });
    req.user.role = user.role;

    next();
  } catch (e) {
    next(e);
  }
};

exports.requireRole =
  (roles = []) =>
  (req, res, next) => {
    if (!roles.length) return next();
    if (!req.user?.role || !roles.includes(req.user.role))
      return res.status(403).json({ success: false, error: 'Forbidden' });
    next();
  };
