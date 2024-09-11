const { loginUser, logoutUser, refreshAccessToken } = require('../controllers/authController');
const express = require('express');
const auth = require('./auth');
const router = express.Router();

router.get('/login', auth(
    (req, res) => res.render('LoginSuccess'), // 성공 시
    (req, res) => res.render('login')         // 실패 시
));
router.post('/login/checkuser', loginUser);

router.get('/logout', logoutUser);

router.get('/tokenRefresh', refreshAccessToken);

module.exports = router;