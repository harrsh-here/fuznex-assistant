const express = require('express');
const router = express.Router();
const subtaskController = require('../controllers/subtaskController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, subtaskController.createSubtask);
router.get('/:taskId', auth, subtaskController.getSubtasksByTaskId);
router.put('/:id', auth, subtaskController.updateSubtask);
router.delete('/:id', auth, subtaskController.deleteSubtask);

module.exports = router;
