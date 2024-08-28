const express = require('express');
const router = express.Router();
const { saveTodoList, loadTodoList } = require('../controllers/todoController');

router.get('/todolist', (req, res) => res.render('TodoList'));
router.post('/todolist/save', saveTodoList);
router.get('/todolist/load/:code', loadTodoList);

module.exports = router;