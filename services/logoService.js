const Logo = require('../models/Logo');

class LogoService {
  static async create(logoData) {
    try {
      console.log('LogoService: Creating new logo:', logoData.name);
      
      // If this is set as default, unset other defaults in the same category
      if (logoData.isDefault) {
        await Logo.updateMany(
          { category: logoData.category, isDefault: true },
          { isDefault: false }
        );
      }

      const logo = new Logo(logoData);
      const savedLogo = await logo.save();
      
      console.log('LogoService: Logo created with ID:', savedLogo._id);
      return savedLogo;
    } catch (error) {
      console.error('LogoService: Error creating logo:', error);
      throw error;
    }
  }

  static async findAll(filters = {}) {
    try {
      console.log('LogoService: Fetching logos with filters:', filters);
      
      const query = {};
      if (filters.category) query.category = filters.category;
      if (filters.isActive !== undefined) query.isActive = filters.isActive;
      if (filters.isDefault !== undefined) query.isDefault = filters.isDefault;

      const logos = await Logo.find(query)
        .populate('uploadedBy', 'firstName lastName email')
        .sort({ createdAt: -1 });
      
      console.log('LogoService: Found', logos.length, 'logos');
      return logos;
    } catch (error) {
      console.error('LogoService: Error fetching logos:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      console.log('LogoService: Finding logo by ID:', id);
      
      const logo = await Logo.findById(id).populate('uploadedBy', 'firstName lastName email');
      
      if (!logo) {
        throw new Error('Logo not found');
      }
      
      console.log('LogoService: Logo found:', logo.name);
      return logo;
    } catch (error) {
      console.error('LogoService: Error finding logo by ID:', error);
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      console.log('LogoService: Updating logo:', id);
      
      // If setting as default, unset other defaults in the same category
      if (updateData.isDefault) {
        const logo = await Logo.findById(id);
        if (logo) {
          await Logo.updateMany(
            { category: logo.category, isDefault: true, _id: { $ne: id } },
            { isDefault: false }
          );
        }
      }

      const updatedLogo = await Logo.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate('uploadedBy', 'firstName lastName email');
      
      if (!updatedLogo) {
        throw new Error('Logo not found');
      }
      
      console.log('LogoService: Logo updated successfully:', updatedLogo.name);
      return updatedLogo;
    } catch (error) {
      console.error('LogoService: Error updating logo:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      console.log('LogoService: Deleting logo:', id);
      
      const deletedLogo = await Logo.findByIdAndDelete(id);
      
      if (!deletedLogo) {
        throw new Error('Logo not found');
      }
      
      console.log('LogoService: Logo deleted successfully:', deletedLogo.name);
      return deletedLogo;
    } catch (error) {
      console.error('LogoService: Error deleting logo:', error);
      throw error;
    }
  }

  static async getDefaultLogo(category = 'main') {
    try {
      console.log('LogoService: Getting default logo for category:', category);
      
      const logo = await Logo.findOne({ 
        category, 
        isDefault: true, 
        isActive: true 
      });
      
      if (!logo) {
        // Fallback to any active logo in the category
        const fallbackLogo = await Logo.findOne({ 
          category, 
          isActive: true 
        }).sort({ createdAt: -1 });
        
        console.log('LogoService: Using fallback logo for category:', category);
        return fallbackLogo;
      }
      
      console.log('LogoService: Default logo found:', logo.name);
      return logo;
    } catch (error) {
      console.error('LogoService: Error getting default logo:', error);
      throw error;
    }
  }

  static async setAsDefault(id) {
    try {
      console.log('LogoService: Setting logo as default:', id);
      
      const logo = await Logo.findById(id);
      if (!logo) {
        throw new Error('Logo not found');
      }

      // Unset other defaults in the same category
      await Logo.updateMany(
        { category: logo.category, isDefault: true, _id: { $ne: id } },
        { isDefault: false }
      );

      // Set this logo as default
      const updatedLogo = await Logo.findByIdAndUpdate(
        id,
        { isDefault: true },
        { new: true }
      );
      
      console.log('LogoService: Logo set as default:', updatedLogo.name);
      return updatedLogo;
    } catch (error) {
      console.error('LogoService: Error setting logo as default:', error);
      throw error;
    }
  }
}

module.exports = LogoService;
