const { checkDuplicate, createAccount } = require('../controllers/accController');
const express = require('express');
const auth = require('./auth');
const router = express.Router();

router.get('/register', auth(
    (req, res) => res.redirect('/login'),    // 성공 시
    (req, res) => res.render('Register')     // 실패 시
));
router.get('/register/checkduplicate', checkDuplicate);
router.post('/register/createaccount', createAccount);

module.exports = router;