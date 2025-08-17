const User = require('../models/User');

class UserService {
  static async create(userData) {
    try {
      console.log('UserService.create called with:', {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role
      });

      const user = new User(userData);
      const savedUser = await user.save();

      console.log('UserService: User created successfully with ID:', savedUser._id);
      return savedUser;
    } catch (error) {
      console.error('UserService.create error:', error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      console.log('UserService.findByEmail called with:', email);
      const user = await User.findOne({ email: email.toLowerCase() });
      console.log('User found:', !!user);
      return user;
    } catch (error) {
      console.error('UserService.findByEmail error:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      console.log('UserService.findById called with:', id);
      const user = await User.findById(id);
      console.log('User found:', !!user);
      return user;
    } catch (error) {
      console.error('UserService.findById error:', error);
      throw error;
    }
  }

  static async updateLastLogin(userId) {
    try {
      console.log('UserService.updateLastLogin called with:', userId);
      const user = await User.findByIdAndUpdate(
        userId,
        { lastLogin: new Date() },
        { new: true }
      );
      console.log('Last login updated for user:', userId);
      return user;
    } catch (error) {
      console.error('UserService.updateLastLogin error:', error);
      throw error;
    }
  }

  static async list(filters = {}) {
    try {
      console.log('UserService.list called with filters:', filters);
      const users = await User.find(filters).select('-password');
      console.log('Found users:', users.length);
      return users;
    } catch (error) {
      console.error('UserService.list error:', error);
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      console.log('UserService.update called with:', id, updateData);
      const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
      console.log('User updated:', !!user);
      return user;
    } catch (error) {
      console.error('UserService.update error:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      console.log('UserService.delete called with:', id);
      const user = await User.findByIdAndDelete(id);
      console.log('User deleted:', !!user);
      return user;
    } catch (error) {
      console.error('UserService.delete error:', error);
      throw error;
    }
  }
}

module.exports = UserService;