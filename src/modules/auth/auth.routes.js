const router = require('express').Router();
const c = require('./auth.controller');

router.post('/register', c.postRegister);
router.post('/login', c.postLogin);
router.post('/refresh', c.postRefresh);
router.post('/logout', c.postLogout);

module.exports = router;
