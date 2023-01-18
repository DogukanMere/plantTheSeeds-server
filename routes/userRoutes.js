const express = require('express');
const {
  userAuth,
  registerUser,
  getProfile,
  updateProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUserById,
  getUserInfo,
} = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

const router = express.Router();

// Routes
router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', userAuth);
router.route('/profile').get(protect, getProfile).put(protect, updateProfile);
router.route('/info').post(protect, admin, getUserInfo);
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUserById);

module.exports = router;
