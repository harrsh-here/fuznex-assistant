const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate JWT Token using id and role
const generateToken = (user) => {
  return jwt.sign(
    { id: user.user_id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Generate Refresh Token using id and role
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.user_id, email: user.email, role: user.role },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

// Refresh Token Endpoint - accepts refreshToken and issues a new access token
exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token is required.' });
  }

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid refresh token.' });
    }

    // Generate new access token using user data from decoded refresh token
    const newAccessToken = jwt.sign(
      {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ accessToken: newAccessToken });
  });
};

// Create a new user (Register)
const disposableDomains = [
  "tempmail.com", "10minutemail.com", "guerrillamail.com", "mailinator.com"
];

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;

  const domain = email.split('@')[1];
  return !disposableDomains.includes(domain.toLowerCase());
};

const isValidPhone = (phone_number) => {
  const phoneRegex = /^[0-9]{10,15}$/; // Adjust based on country rules
  return phoneRegex.test(phone_number);
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, phone_number, password } = req.body;

    // Validate fields
    if (!name || !email || !phone_number || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Validate email format and block temporary emails
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid or temporary email address.' });
    }

    // Validate phone number format
    if (!isValidPhone(phone_number)) {
      return res.status(400).json({ error: 'Invalid phone number format.' });
    }

    // Check if email already exists
    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    // Check if phone number already exists
    const existingUserByPhone = await User.findOne({ where: { phone_number } });
    if (existingUserByPhone) {
      return res.status(400).json({ error: 'Phone number already registered.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await User.create({
      name,
      email,
      phone_number,
      password: hashedPassword,
      created_at: new Date(),
    });

    // Convert user to plain object and remove password
    const userData = newUser.toJSON();
    delete userData.password;

    // Generate JWT token and Refresh Token
    const token = generateToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    res.status(201).json({ message: 'User created successfully', user: userData, token, refreshToken });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect password' });
    }

    // Remove password from response
    const userData = user.toJSON();
    delete userData.password;

    // Generate JWT token and Refresh Token
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    
    res.json({ message: 'Login successful', user: userData, token, refreshToken });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all users (Protected - Admin only)
exports.getUsers = async (req, res) => {
  try {
    // Only allow admins to get all users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    const users = await User.findAll();
    const sanitized = users.map(u => {
      const userObj = u.toJSON();
      delete userObj.password;
      return userObj;
    });
    res.json(sanitized);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get my profile (Protected - returns only the logged-in user's data)
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id); // Assumes req.user.id is set by auth middleware
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userData = user.toJSON();
    delete userData.password;
    res.json(userData);
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get user by ID (Protected)
exports.getUserById = async (req, res) => {
  try {
    // Authorization check:
    // Allow access only if the logged-in user is admin OR is requesting their own profile.
    if (parseInt(req.params.id) !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. You can only view your own profile.' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userData = user.toJSON();
    delete userData.password;
    res.json(userData);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update user (Protected)
exports.updateUser = async (req, res) => {
  try {
    // Authorization check: Only allow a user to update their own account.
    if (parseInt(req.params.id) !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. You can only update your own account.' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    await user.update(req.body);
    const updatedUser = user.toJSON();
    delete updatedUser.password;
    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete user (Protected)
exports.deleteUser = async (req, res) => {
  try {
    // Authorization check: Only allow a user to delete their own account.
    if (parseInt(req.params.id) !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. You can only delete your own account.' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
