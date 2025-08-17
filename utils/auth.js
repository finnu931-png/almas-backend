const jwt = require('jsonwebtoken');

const generateAccessToken = (payload) => {
  try {
    console.log('Generating access token for user:', payload.email);
    const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    console.log('Access token generated successfully');
    return token;
  } catch (error) {
    console.error('Error generating access token:', error);
    throw error;
  }
};

const generateRefreshToken = (payload) => {
  try {
    console.log('Generating refresh token for user:', payload.email);
    const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    console.log('Refresh token generated successfully');
    return token;
  } catch (error) {
    console.error('Error generating refresh token:', error);
    throw error;
  }
};

const verifyAccessToken = (token) => {
  try {
    console.log('Verifying access token...');
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    console.log('Access token verified successfully for user:', decoded.email);
    return decoded;
  } catch (error) {
    console.error('Error verifying access token:', error);
    throw error;
  }
};

const verifyRefreshToken = (token) => {
  try {
    console.log('Verifying refresh token...');
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    console.log('Refresh token verified successfully for user:', decoded.email);
    return decoded;
  } catch (error) {
    console.error('Error verifying refresh token:', error);
    throw error;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};