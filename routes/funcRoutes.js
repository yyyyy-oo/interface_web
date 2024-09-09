const { saveTodoList, loadTodoList } = require('../controllers/todoController');
const { auth } = require('../modules/tokenControl');
const express = require('express');
const router = express.Router();

router.get('/todolist', (req, res) => res.render('TodoList'));
router.post('/todolist/save', saveTodoList);
router.get('/todolist/load/:code', loadTodoList);

router.get('/chat', auth, (req, res) => {
    if (req.isAuthenticated) res.render('chat')
    else res.redirect('/Login');
});

module.exports = router;