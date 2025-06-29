const express = require('express');
const router = express.Router();
const alarmController = require('../controllers/alarmController');
const verifyUser = require('../middleware/authMiddleware');

router.post('/', verifyUser, alarmController.createAlarm);
router.get('/', verifyUser, alarmController.getAlarms);
router.get('/:id', verifyUser, alarmController.getAlarmById);
router.put('/:id', verifyUser, alarmController.updateAlarm);
router.delete('/:id', verifyUser, alarmController.deleteAlarm);
router.put('/:id/toggle', verifyUser, alarmController.toggleAlarm);

module.exports = router;
