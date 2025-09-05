const { BadRequestError } = require('./errors');

function assertOrgScope(where = {}, orgId) {
    
  // Defensive check to avoid multi-tenant leakage
  if (!orgId) throw BadRequestError('Missing orgId for scoped query');
  if (where.organizationId && where.organizationId !== orgId) {
    throw BadRequestError('Mismatched organization scope');
  }
  return { ...where, organizationId: orgId };
}

module.exports = { assertOrgScope };
