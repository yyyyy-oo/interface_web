const { checkDuplicate, createAccount } = require('../controllers/accController');
const { auth } = require('../modules/tokenControl');
const express = require('express');
const router = express.Router();

router.get('/register', auth, (req, res) => {
    if (req.isAuthenticated) res.redirect('/login')
    else res.render('Register');
});
router.get('/register/checkduplicate', checkDuplicate);
router.post('/register/createaccount', createAccount);

module.exports = router;