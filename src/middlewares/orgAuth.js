const prisma = require('../prisma/client');
const {
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} = require('../utils/errors');
const { isAllowedByList } = require('../utils/roles');

/**
 * Loads the organization and the user's membership for the given :orgId
 * Attaches: req.org, req.membership
 * Throws:
 *  - 404 if org not found
 *  - 401 if user not authenticated
 *  - 403 if user not a member (unless platform ADMIN override is on)
 */
async function loadOrgContext(
  req,
  res,
  next,
  { allowPlatformAdmin = true } = {}
) {
  try {
    if (!req.user) throw UnauthorizedError('Authentication required');

    const orgId = req.params.orgId;

    if (!orgId) throw ForbiddenError('Missing orgId in route');
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { id: true, name: true, subscriptionPlan: true, ownerId: true },
    });

    if (!org) throw NotFoundError('Organization not found');

    const membership = await prisma.membership.findFirst({
      where: { organizationId: orgId, userId: req.user.id },
      select: { id: true, role: true, organizationId: true, userId: true },
    });

    // Platform ADMIN (global) bypass if allowed
    const isPlatformAdmin = req.user.role === 'ADMIN';

    if (!membership && !(allowPlatformAdmin && isPlatformAdmin)) {
      throw ForbiddenError('You are not a member of this organization');
    }

    req.org = org;
    // attach membership if exists; if platform admin bypassed, attach a synthetic ADMIN membership
    req.membership =
      membership ||
      (isPlatformAdmin
        ? { role: 'ADMIN', userId: req.user.id, organizationId: orgId }
        : null);

    return next();
  } catch (err) {
    next(err);
  }
}

/**
 * Enforces that the current user has one of the allowed org roles.
 * Automatically loads org + membership if not already loaded.
 * Usage:
 *   router.get('/:orgId/projects', requireAuth, requireOrgRole(['OWNER','ADMIN','MEMBER','GUEST']), handler)
 */
function requireOrgRole(
  allowedRoles = [],
  options = { allowPlatformAdmin: true }
) {
  return async (req, res, next) => {
    try {
      if (!req.org || !req.membership) {
        await loadOrgContext(req, res, () => {}, options);
      }
      const isPlatformAdmin =
        req.user?.role === 'ADMIN' && options.allowPlatformAdmin;

      if (isPlatformAdmin) return next();

      if (!req.membership) throw ForbiddenError('Not a member');

      if (!isAllowedByList(req.membership.role, allowedRoles)) {
        throw ForbiddenError('Insufficient organization role');
      }

      return next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  requireOrgRole,
  loadOrgContext, // exported in case you want to force-load in some custom flows
};
