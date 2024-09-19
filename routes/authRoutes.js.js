const { loginUser, logoutUser, refreshAccessToken } = require('../controllers/authController');
const express = require('express');
const authenticate = require('./authMiddleware');
const router = express.Router();

router.get('/login', authenticate(
    (req, res) => res.render('LoginSuccess'), // 성공 시
    (req, res) => res.render('Login')         // 실패 시
));
router.post('/login/checkuser', loginUser);

router.get('/logout', logoutUser);

router.get('/tokenRefresh', refreshAccessToken);

module.exports = router;