const express = require('express');
const router = express.Router();
const { requireUser } = require('./middleware/auth');
const UserService = require('../services/userService');

// GET /api/users/profile - Get current user profile
router.get('/profile', requireUser, async (req, res) => {
  try {
    console.log('GET /api/users/profile - Fetching user profile');
    console.log('req.user:', req.user);
    console.log('req.user.id:', req.user.id);
    console.log('req.user._id:', req.user._id);

    // Try both id and _id fields from the token
    const userId = req.user.id || req.user._id;
    
    if (!userId) {
      console.error('No user ID found in token payload');
      return res.status(400).json({
        success: false,
        error: 'Invalid token payload - missing user ID'
      });
    }

    console.log('Looking up user with ID:', userId);
    const user = await UserService.findById(userId);

    if (!user) {
      console.log('User not found with ID:', userId);
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    console.log('User profile found for:', user.email);

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile',
      message: error.message
    });
  }
});

module.exports = router;