const prisma = require('../prisma/client');
const { ForbiddenError } = require('../utils/errors');

const PLAN_LIMITS = {
  FREE: { MEMBERS: 5, PROJECTS: 3 },
  PRO: { MEMBERS: 50, PROJECTS: 20 },
  ENTERPRISE: { MEMBERS: Infinity, PROJECTS: Infinity },
};

function checkPlanLimit(resource /* 'MEMBERS' | 'PROJECTS' */) {
  return async (req, res, next) => {
    try {
      const orgId = req.org?.id || req.params.orgId;
      if (!orgId) throw new ForbiddenError('Organization context missing');

      const org = await prisma.organization.findUnique({
        where: { id: orgId },
        select: { subscriptionPlan: true },
      });
      if (!org) throw new ForbiddenError('Organization not found');

      const plan = org.subscriptionPlan || 'FREE';
      const limit = PLAN_LIMITS[plan]?.[resource];
      if (limit == null) return next();

      let used = 0;
      if (resource === 'MEMBERS') {
        used = await prisma.membership.count({
          where: { organizationId: orgId },
        });
      } else if (resource === 'PROJECTS') {
        used = await prisma.project.count({ where: { organizationId: orgId } });
      }

      if (used >= limit) {
        throw new ForbiddenError(
          `Plan limit exceeded: ${resource.toLowerCase()} for ${plan} plan (max ${limit}).`
        );
      }
      next();
    } catch (e) {
      next(e);
    }
  };
}

module.exports = { checkPlanLimit, PLAN_LIMITS };
