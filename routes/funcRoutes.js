const { saveTodoList, loadTodoList } = require('../controllers/todoController');
const express = require('express');
const auth = require('./auth');
const router = express.Router();

router.get('/todolist', (req, res) => res.render('TodoList'));
router.post('/todolist/save', saveTodoList);
router.get('/todolist/load/:code', loadTodoList);

router.get('/chat', auth(
    (req, res) => res.render('chat'), // 성공 시
    (req, res) => res.render('login') // 실패 시
));

module.exports = router;