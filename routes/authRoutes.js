const express = require('express');
const { checkDuplicate, createAccount, checkUser } = require('../controllers/authController');
const router = express.Router();

router.get('/register', (req, res) => res.render('Register'));
router.get('/register/checkduplicate', checkDuplicate);
router.post('/register/createaccount', createAccount);
router.get('/login', (req, res) => res.render('Login'));
router.post('/login/checkuser', checkUser);

module.exports = router;