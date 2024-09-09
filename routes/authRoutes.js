const { checkUser, logoutUser } = require('../controllers/authController');
const { auth } = require('../modules/tokenControl');
const express = require('express');
const router = express.Router();

router.get('/login', auth, (req, res) => {
    if (req.isAuthenticated) res.render('LoginSuccess');
    else res.render('Login');
});
router.post('/login/checkuser', checkUser);

router.get('/logout', logoutUser);

module.exports = router;