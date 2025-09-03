const { register, login, rotateRefreshToken, revokeRefreshToken } = require('./auth.service');

exports.postRegister = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const result = await register({ email, password, name });
    res.status(201).json({ success: true, data: result });
  } catch (e) { next(e); }
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await login({ email, password });
    res.json({ success: true, data: result });
  } catch (e) { next(e); }
};

exports.postRefresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body; // opaque string we issued
    if (!refreshToken) throw new Error('Missing refresh token');
    // decode sub from access? we store userId w/ token; simple: ask client to send userId or decode an expired access?
    // safer: lookup by hash only, get userId from record
    // We'll keep userId in body for now to keep snippet small:
    const { userId } = req.body;
    const result = await rotateRefreshToken(userId, refreshToken);
    res.json({ success: true, data: result });
  } catch (e) { next(e); }
};

exports.postLogout = async (req, res, next) => {
  try {
    const { refreshToken, userId } = req.body;

    if (!refreshToken) throw new Error("No Refresh Token") 
    const result = await revokeRefreshToken(userId, refreshToken);
    
    res.json({ success: true, data: { loggedOut: true,result } });
  } catch (e) { next(e); }
};
