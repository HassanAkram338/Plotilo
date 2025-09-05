const router = require('express').Router();
const { requireAuth } = require('../../middlewares/auth');
const { requireOrgRole } = require('../../middlewares/orgAuth');
const { validate } = require('../../middlewares/validate');
const c = require('./invite.controller');

const { invitationCreationSchema } = require('../../validation/invite.schemas');
const { checkPlanLimit } = require('../../middlewares/planCheck');

router.post(
  '/organizations/:orgId/invites',
  requireAuth,
  validate(invitationCreationSchema),
  requireOrgRole(['OWNER', 'ADMIN']),
  checkPlanLimit("MEMBERS"),
  c.postCreate
);
router.post('/invites/accept', requireAuth, c.postAccept);

module.exports = router;
