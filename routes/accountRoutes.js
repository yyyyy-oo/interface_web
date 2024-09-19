const { checkDuplicate, createAccount, loadUserInfo, updateUserInfo } = require('../controllers/accController');
const express = require('express');
const authenticate = require('./authMiddleware');
const router = express.Router();

router.get('/register', authenticate(
    (req, res) => res.redirect('/login'),    // 성공 시
    (req, res) => res.render('Register')     // 실패 시
));
router.get('/register/checkduplicate', checkDuplicate);
router.post('/register/createaccount', createAccount);

router.get('/mypage', authenticate(
    (req, res) => res.render('Mypage'), // 성공 시
    (req, res) => res.render('Login') // 실패 시
));
router.get('/mypage/load', loadUserInfo);
router.post('/mypage/update', updateUserInfo);

module.exports = router;