const svc = require('./membership.service');

exports.getMembers = async (req, res, next) => {
  try {
    const list = await svc.listMembers(req.org.id);
    res.json({ success: true, data: list });
  } catch (e) { next(e); }
};

exports.getMember = async (req, res, next) => {
  try {
    const member = await svc.getMember({
      orgId: req.org.id,
      memberId: req.params.memberId,
    });
    res.json({ success: true, data: member });
  } catch (e) { next(e); }
};

exports.patchRole = async (req, res, next) => {
  try {
    const updated = await svc.changeRole({
      orgId: req.org.id,
      memberId: req.params.memberId,
      role: req.body.role,
    });
    res.json({ success: true, data: updated });
  } catch (e) { next(e); }
};

exports.deleteMember = async (req, res, next) => {
  try {
    await svc.removeMember({ orgId: req.org.id, memberId: req.params.memberId });
    res.json({ success: true, data: { removed: true } });
  } catch (e) { next(e); }
};

exports.transferOwnership = async (req, res, next) => {
  try {
    const updated = await svc.transferOwnership({
      orgId: req.org.id,
      fromUserId: req.user.id,
      toMemberId: req.params.memberId,
    });
    res.json({ success: true, data: updated });
  } catch (e) { next(e); }
};

exports.leaveOrg = async (req, res, next) => {
  try {
    await svc.leaveOrganization({
      orgId: req.org.id,
      userId: req.user.id,
    });
    res.json({ success: true, data: { left: true } });
  } catch (e) { next(e); }
};
