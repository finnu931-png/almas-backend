const express = require('express');
const router = express.Router();
const { hashPassword, comparePassword } = require('../utils/password');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/auth');
const UserService = require('../services/userService');

console.log('AuthRoutes: Module loaded and router created');

// POST /api/auth/register - User registration
router.post('/register', async (req, res) => {
  try {
    console.log('POST /api/auth/register - Registration request received');
    console.log('Request body:', req.body);

    const { email, password, firstName, lastName, company, phone } = req.body;

    console.log('Registration request received:', {
      email,
      firstName,
      lastName,
      company: company || req.body.companyName
    });

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      console.log('Registration failed: Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Email, password, first name, and last name are required'
      });
    }

    // Check if user already exists
    console.log('Checking if user already exists...');
    const existingUser = await UserService.findByEmail(email);
    if (existingUser) {
      console.log('Registration failed: User already exists');
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await hashPassword(password);

    // Create user
    console.log('Creating new user...');
    const userData = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      company: company || req.body.companyName || '',
      phone: phone || req.body.phoneNumber || '',
      role: 'user',
      isActive: true,
      emailVerified: false
    };

    const user = await UserService.create(userData);
    console.log('User created successfully with ID:', user._id);

    // Generate tokens with consistent field naming
    console.log('Generating tokens...');
    const tokenPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    };
    console.log('Token payload:', tokenPayload);

    const accessToken = generateAccessToken(tokenPayload);

    console.log('Registration successful for user:', user.email);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      accessToken
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed',
      message: error.message
    });
  }
});

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
  try {
    console.log('POST /api/auth/login - Login request received');
    console.log('Request body:', req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    console.log('Login attempt for email:', email);

    // Find user
    const user = await UserService.findByEmail(email);
    if (!user) {
      console.log('Login failed: User not found');
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Verify password
    console.log('Verifying password...');
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      console.log('Login failed: Invalid password');
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Update last login
    await UserService.updateLastLogin(user._id);

    // Generate tokens with consistent field naming
    console.log('Generating tokens...');
    const tokenPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    };
    console.log('Token payload:', tokenPayload);

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload); // Use same payload structure

    console.log('Login successful for user:', user.email);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
      message: error.message
    });
  }
});

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', async (req, res) => {
  try {
    console.log('POST /api/auth/refresh - Token refresh request received');

    const { refreshToken } = req.body;

    if (!refreshToken) {
      console.log('Token refresh failed: No refresh token provided');
      return res.status(401).json({
        success: false,
        error: 'Refresh token required'
      });
    }

    // Verify refresh token
    console.log('Verifying refresh token...');
    const decoded = verifyRefreshToken(refreshToken);
    console.log('Decoded refresh token:', decoded);

    // Extract user ID - handle both 'id' and 'userId' fields for backward compatibility
    const userId = decoded.id || decoded.userId;
    console.log('Extracted user ID:', userId);

    if (!userId) {
      console.log('Token refresh failed: No user ID in token');
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token - missing user ID'
      });
    }

    // Find user
    const user = await UserService.findById(userId);
    if (!user) {
      console.log('Token refresh failed: User not found');
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }

    // Generate new access token
    console.log('Generating new access token...');
    const tokenPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    };
    console.log('New token payload:', tokenPayload);

    const accessToken = generateAccessToken(tokenPayload);

    console.log('Token refresh successful for user:', user.email);

    res.json({
      success: true,
      accessToken
    });

  } catch (error) {
    console.error('Token refresh error:', error.message);
    res.status(401).json({
      success: false,
      error: 'Token refresh failed',
      message: error.message
    });
  }
});

// POST /api/auth/logout - User logout
router.post('/logout', async (req, res) => {
  try {
    console.log('POST /api/auth/logout - Logout request received');

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed',
      message: error.message
    });
  }
});

console.log('AuthRoutes: All routes defined');

module.exports = router;