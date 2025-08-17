const HomepageSection = require('../models/HomepageSection');

class HomepageSectionService {
  static async create(sectionData) {
    try {
      console.log('HomepageSectionService: Creating new homepage section:', sectionData.title);
      const section = new HomepageSection(sectionData);
      const savedSection = await section.save();
      console.log('HomepageSectionService: Homepage section created successfully with ID:', savedSection._id);
      return savedSection;
    } catch (error) {
      console.error('HomepageSectionService: Error creating homepage section:', error.message);
      throw error;
    }
  }

  static async getAll(filters = {}) {
    try {
      console.log('HomepageSectionService: Fetching all homepage sections with filters:', filters);
      const query = { ...filters };
      const sections = await HomepageSection.find(query).sort({ order: 1, createdAt: -1 });
      console.log('HomepageSectionService: Found', sections.length, 'homepage sections');
      return sections;
    } catch (error) {
      console.error('HomepageSectionService: Error fetching homepage sections:', error.message);
      throw error;
    }
  }

  static async getById(id) {
    try {
      console.log('HomepageSectionService: Fetching homepage section by ID:', id);
      const section = await HomepageSection.findById(id);
      if (!section) {
        console.log('HomepageSectionService: Homepage section not found with ID:', id);
        return null;
      }
      console.log('HomepageSectionService: Homepage section found:', section.title);
      return section;
    } catch (error) {
      console.error('HomepageSectionService: Error fetching homepage section by ID:', error.message);
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      console.log('HomepageSectionService: Updating homepage section with ID:', id);
      const section = await HomepageSection.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      if (!section) {
        console.log('HomepageSectionService: Homepage section not found for update with ID:', id);
        return null;
      }
      console.log('HomepageSectionService: Homepage section updated successfully:', section.title);
      return section;
    } catch (error) {
      console.error('HomepageSectionService: Error updating homepage section:', error.message);
      throw error;
    }
  }

  static async delete(id) {
    try {
      console.log('HomepageSectionService: Deleting homepage section with ID:', id);
      const section = await HomepageSection.findByIdAndDelete(id);
      if (!section) {
        console.log('HomepageSectionService: Homepage section not found for deletion with ID:', id);
        return null;
      }
      console.log('HomepageSectionService: Homepage section deleted successfully:', section.title);
      return section;
    } catch (error) {
      console.error('HomepageSectionService: Error deleting homepage section:', error.message);
      throw error;
    }
  }

  static async getBySectionType(sectionType) {
    try {
      console.log('HomepageSectionService: Fetching homepage sections by type:', sectionType);
      const sections = await HomepageSection.find({ 
        sectionType, 
        isActive: true 
      }).sort({ order: 1 });
      console.log('HomepageSectionService: Found', sections.length, 'sections for type:', sectionType);
      return sections;
    } catch (error) {
      console.error('HomepageSectionService: Error fetching sections by type:', error.message);
      throw error;
    }
  }
}

module.exports = HomepageSectionService;