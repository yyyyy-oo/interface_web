const express = require('express');
const router = express.Router();
const { checkDuplicate, createAccount } = require('../controllers/accController');

router.get('/register', (req, res) => {
    if (req.session.user) res.redirect('/');
    else res.render('Register');
})
router.get('/register/checkduplicate', checkDuplicate);
router.post('/register/createaccount', createAccount);

module.exports = router;