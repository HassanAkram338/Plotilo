const router = require('express').Router();
const { requireAuth } = require('../../middlewares/auth');
const { requireOrgRole } = require('../../middlewares/orgAuth');
const c = require('./org.controller');
const { validate } = require('../../middlewares/validate');

const {
  createOrgSchema,
  getOneOrgSchema,
  updateOrgSchema,
  deleteOrgSchema,
} = require('../../validation/org.schemas');

router.post('/', requireAuth, validate(createOrgSchema), c.postCreate);
router.get('/', requireAuth, c.getMine);
router.get(
  '/:orgId',
  requireAuth,
  validate(getOneOrgSchema),
  requireOrgRole(['OWNER', 'ADMIN', 'MEMBER']),
  c.getOne
);
router.put(
  '/:orgId',
  requireAuth,
  validate(updateOrgSchema),
  requireOrgRole(['OWNER', 'ADMIN']),
  c.postUpdate
);
router.delete(
  '/:orgId',
  requireAuth,
  validate(deleteOrgSchema),
  requireOrgRole(['OWNER']),
  c.postDelete
);

module.exports = router;
