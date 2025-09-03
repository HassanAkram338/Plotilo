const router = require('express').Router();
const { requireAuth } = require('../../middlewares/auth');
const { requireOrgRole } = require('../../middlewares/orgAuth');
const { validate } = require('../../middlewares/validate');
const c = require('./invite.controller');

const { invitationCreationSchema } = require('../../validation/invite.schemas');

router.post(
  '/organizations/:orgId/invites',
  requireAuth,
  validate(invitationCreationSchema),
  requireOrgRole(['OWNER', 'ADMIN']),
  c.postCreate
);
router.post('/invites/accept', requireAuth, c.postAccept);

module.exports = router;
