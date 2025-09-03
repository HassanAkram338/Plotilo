const prisma = require('../prisma/client');

exports.requireOrgRole = (roles = []) => {
  return async (req, res, next) => {
    try {
      const orgId = req.params.orgId || req.body.organizationId || req.query.orgId;
      if (!orgId) return res.status(400).json({ success: false, error: 'Missing orgId' });

      const mem = await prisma.membership.findFirst({
        where: { userId: req.user.id, organizationId: orgId },
      });
      if (!mem) return res.status(403).json({ success: false, error: 'Not a member' });
      if (roles.length && !roles.includes(mem.role))
        return res.status(403).json({ success: false, error: 'Insufficient role' });

      req.org = { id: orgId, role: mem.role };
      next();
    } catch (e) { next(e); }
  };
};
