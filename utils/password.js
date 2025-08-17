const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  try {
    console.log('Hashing password...');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Password hashed successfully');
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
};

const comparePassword = async (password, hashedPassword) => {
  try {
    console.log('Comparing password...');
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log('Password comparison result:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Error comparing password:', error);
    throw error;
  }
};

module.exports = {
  hashPassword,
  comparePassword
};