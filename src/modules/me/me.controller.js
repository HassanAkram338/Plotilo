const svc = require('./me.service');

exports.getMyMemberships = async (req, res, next) => {
  try {
    const result = await svc.listMyMemberships(req.user.id);
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
};
