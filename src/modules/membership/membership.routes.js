const router = require('express').Router();
const { requireAuth } = require('../../middlewares/auth');
const { requireOrgRole } = require('../../middlewares/orgAuth');
const {validate} = require("../../middlewares/validate")
const c = require('./membership.controller');

const {
  listMembersSchema,
  getMemberSchema,
  patchRoleSchema,
  deleteMemberSchema,
  transferOwnershipSchema,
  leaveOrgSchema,
} = require('../../validation/membership.schemas');

router.get(
  '/:orgId/members',
  requireAuth,
  validate(listMembersSchema),
  requireOrgRole(['OWNER', 'ADMIN', 'MEMBER']),
  c.getMembers
);
router.patch(
  '/:orgId/members/:memberId',
  requireAuth,
  validate(patchRoleSchema),
  requireOrgRole(['OWNER', 'ADMIN']),
  c.patchRole
);
router.delete(
  '/:orgId/members/:memberId',
  requireAuth,
  validate(deleteMemberSchema),
  requireOrgRole(['OWNER', 'ADMIN']),
  c.deleteMember
);
router.get(
  '/:orgId/members/:memberId',
  requireAuth,
  validate(getMemberSchema),
  requireOrgRole(['OWNER', 'ADMIN', 'MEMBER']),
  c.getMember
);
router.post(
  '/:orgId/members/:memberId/transfer-ownership',
  requireAuth,
  validate(transferOwnershipSchema),
  requireOrgRole(['OWNER']),
  c.transferOwnership
);
router.delete(
  '/:orgId/members/self/leave',
  requireAuth,
  validate(leaveOrgSchema),
  requireOrgRole(['OWNER', 'ADMIN', 'MEMBER']),
  c.leaveOrg
);

module.exports = router;
