const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Public Routes
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/refresh-token', userController.refreshToken);

// Protected Routes (JWT required)
router.get('/', authMiddleware, userController.getUsers);
router.get('/profile', authMiddleware, userController.getMyProfile);
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);
//router.patch("/update-profile", authMiddleware, updateUserProfile);
//router.patch("/change-password", authMiddleware, changeUserPassword);

module.exports = router;
