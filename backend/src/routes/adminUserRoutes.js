const express = require('express');
const adminUserController = require('../controllers/adminUserController');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, isAdmin);

router.get('/users', adminUserController.listUsers);
router.get('/users/:userId', adminUserController.getUserById);
router.patch('/users/:userId/role', adminUserController.updateUserRole);
router.patch('/users/:userId/status', adminUserController.updateUserStatus);

module.exports = router;
