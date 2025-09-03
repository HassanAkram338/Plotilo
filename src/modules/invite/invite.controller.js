const svc = require('./invite.service');

exports.postCreate = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { invite, code } = await svc.createInvite({
      orgId: req.org.id,
      email,
      creatorUserId: req.user.id,
    });
    res.status(201).json({ success: true, data: { invite, code } }); // show once (or email it)
  } catch (e) { next(e); }
};

exports.postAccept = async (req, res, next) => {
  try {
    const { code } = req.body;
    const result = await svc.acceptInvite({ code, userId: req.user.id });
    res.json({ success: true, data: result });
  } catch (e) { next(e); }
};
