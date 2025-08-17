const { verifyAccessToken } = require('../../utils/auth');

const requireUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Auth middleware: No valid authorization header found');
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log('Auth middleware: Verifying token...');
    
    const decoded = verifyAccessToken(token);
    console.log('Auth middleware: Token verified successfully for user:', decoded.email);
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }
    
    return res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

module.exports = { requireUser };