const express = require('express');
const router = express.Router();
const { checkUser, logoutUser } = require('../controllers/authController');

router.get('/login', (req, res) => {
    if (req.session.user) res.render('LoginSuccess')
    else res.render('Login')
});
router.post('/login/checkuser', checkUser);

// router.get('/logout', logoutUser);

router.get('/logout', (req, res) => {
    if (req.session.user) logoutUser(req, res)
    else res.redirect('/login');
});

module.exports = router;