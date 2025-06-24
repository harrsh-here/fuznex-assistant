const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const verifyUser = require('../middleware/authMiddleware');

router.post('/', verifyUser, todoController.createTodo);
router.get('/', verifyUser, todoController.getTodos);
router.get('/:id', verifyUser, todoController.getTodoById);
router.put('/:id', verifyUser, todoController.updateTodo);
router.delete('/:id', verifyUser, todoController.deleteTodo);

module.exports = router;
