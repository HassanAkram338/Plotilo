const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middlewares/auth');
const { health } = require('../controllers/healthController');

/// Routes
const authRoutes = require('../modules/auth/auth.routes');
const orgRoutes = require('../modules/org/org.routes');
const membershipRoutes = require('../modules/membership/membership.routes');
const inviteRoutes = require('../modules/invite/invite.routes');
const projectRotes = require("../modules/project/project.routes")


router.get('/health', health);
router.use('/auth', authRoutes);
router.use('/organizations', orgRoutes);
router.use('/organizations', membershipRoutes);
router.use("/",inviteRoutes)
router.use("/organizations",projectRotes)


router.get('/me', requireAuth, (req, res) => {
  res.json({ success: true, data: { userId: req.user.id, role: req.user.role } });
});

router.get('/admin-only', requireAuth, requireRole(['ADMIN']), (req, res) => {
  res.json({ success: true, data: 'secret' });
});


module.exports = router;
