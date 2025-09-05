const router = require('express').Router();
const { requireAuth } = require('../../middlewares/auth');
const c = require('./me.controller');

router.get('/memberships', requireAuth, c.getMyMemberships);

module.exports = router;


