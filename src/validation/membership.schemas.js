const { z, objectId, orgRole } = require('./common');

// GET /organizations/:orgId/members
const listMembersSchema = {
  params: z.object({ orgId: objectId }),
};

// GET /organizations/:orgId/members/:memberId
const getMemberSchema = {
  params: z.object({ orgId: objectId, memberId: objectId }),
};

// PATCH /organizations/:orgId/members/:memberId  (role change)
const patchRoleSchema = {
  params: z.object({ orgId: objectId, memberId: objectId }),
  body: z.object({ role: orgRole }),
};

// DELETE /organizations/:orgId/members/:memberId
const deleteMemberSchema = {
  params: z.object({ orgId: objectId, memberId: objectId }),
};

// POST /organizations/:orgId/members/:memberId/transfer-ownership
const transferOwnershipSchema = {
  params: z.object({ orgId: objectId, memberId: objectId }),
};

// DELETE /organizations/:orgId/members/self/leave
const leaveOrgSchema = {
  params: z.object({ orgId: objectId }),
};

module.exports = {
  listMembersSchema,
  getMemberSchema,
  patchRoleSchema,
  deleteMemberSchema,
  transferOwnershipSchema,
  leaveOrgSchema,
};
