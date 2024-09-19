const { saveTodoList, loadTodoList } = require('../controllers/todoController');
const { loadMessage } = require('../controllers/chatController');
const express = require('express');
const authenticate = require('./authMiddleware');
const router = express.Router();

router.get('/todolist', (req, res) => res.render('TodoList'));
router.post('/todolist/save', saveTodoList);
router.get('/todolist/load/:code', loadTodoList);

router.get('/chat', authenticate(
    (req, res) => res.render('Chat'), // 성공 시
    (req, res) => res.render('Login') // 실패 시
));
router.get('/chat/load/:roomcode', loadMessage);

module.exports = router;