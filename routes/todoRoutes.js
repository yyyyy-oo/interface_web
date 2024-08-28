const express = require('express');
const { saveTodoList, loadTodoList } = require('../controllers/todoController');
const router = express.Router();

router.get('/todolist', (req, res) => res.render('TodoList'));
router.post('/savetodolist', saveTodoList);
router.get('/loadtodolist/:code', loadTodoList);

module.exports = router;