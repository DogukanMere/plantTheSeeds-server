const User = require('../models/userModule');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('express-async-handler');

// POST - /api/users/login
// Auth users and get token
const userAuth = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// POST - /api/users
// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExist = await User.findOne({ email });
  if (name.trim() === '') {
    res.status(400);
    throw new Error('You must enter a name');
  }

  if (userExist) {
    res.status(400);
    throw new Error('This user already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// GET - /api/users/profile
// Get user profile | Private
const getProfile = asyncHandler(async (req, res) => {
  const { _id, name, email, isAdmin } = req.user;
  res.send({ _id, name, email, isAdmin });
});

// PUT - /api/users/profile
// Update user profile | Private

const updateProfile = asyncHandler(async (req, res) => {
  const { id, name, email, password } = req.body;
  const user = await User.findById(id);

  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
      user.password = password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// ADMIN

// GET - /api/users/info
// Get user profile | Private/admin
const getUserInfo = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const userInfo = await User.findById(id);

  if (userInfo) {
    res.status(200).json(userInfo);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// GET - /api/users/
// Get all users | Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// GET - /api/users/:id
// Get specific user | Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// DELETE - /api/users/:id
// Delete user | Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: 'User successfully removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// PUT - /api/users/:id
// Update user profile | Private/Admin

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updatedUserByAdmin = await user.save();

    res.status(200).json({
      _id: updatedUserByAdmin._id,
      name: updatedUserByAdmin.name,
      email: updatedUserByAdmin.email,
      isAdmin: updatedUserByAdmin.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  userAuth,
  registerUser,
  getProfile,
  updateProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUserById,
  getUserInfo,
};
