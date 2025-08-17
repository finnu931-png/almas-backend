const CaseStudy = require('../models/CaseStudy');

class CaseStudyService {
  static async create(caseStudyData) {
    console.log('CaseStudyService: Creating new case study:', caseStudyData.title);

    try {
      const caseStudy = new CaseStudy(caseStudyData);
      const savedCaseStudy = await caseStudy.save();
      console.log('CaseStudyService: Case study created successfully with ID:', savedCaseStudy._id);
      return savedCaseStudy;
    } catch (error) {
      console.error('CaseStudyService: Error creating case study:', error);
      throw new Error(`Failed to create case study: ${error.message}`);
    }
  }

  static async getAll() {
    console.log('CaseStudyService: Fetching all case studies');

    try {
      const caseStudies = await CaseStudy.find().sort({ createdAt: -1 });
      console.log(`CaseStudyService: Found ${caseStudies.length} case studies`);
      return caseStudies;
    } catch (error) {
      console.error('CaseStudyService: Error fetching case studies:', error);
      throw new Error(`Failed to fetch case studies: ${error.message}`);
    }
  }

  static async getById(id) {
    console.log('CaseStudyService: Fetching case study by ID:', id);

    try {
      const caseStudy = await CaseStudy.findById(id);
      if (!caseStudy) {
        console.log('CaseStudyService: Case study not found with ID:', id);
        throw new Error('Case study not found');
      }
      console.log('CaseStudyService: Case study found:', caseStudy.title);
      return caseStudy;
    } catch (error) {
      console.error('CaseStudyService: Error fetching case study by ID:', error);
      throw new Error(`Failed to fetch case study: ${error.message}`);
    }
  }

  static async update(id, updateData) {
    console.log('CaseStudyService: Updating case study with ID:', id);

    try {
      const caseStudy = await CaseStudy.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!caseStudy) {
        console.log('CaseStudyService: Case study not found for update with ID:', id);
        throw new Error('Case study not found');
      }

      console.log('CaseStudyService: Case study updated successfully:', caseStudy.title);
      return caseStudy;
    } catch (error) {
      console.error('CaseStudyService: Error updating case study:', error);
      throw new Error(`Failed to update case study: ${error.message}`);
    }
  }

  static async delete(id) {
    console.log('CaseStudyService: Deleting case study with ID:', id);

    try {
      const caseStudy = await CaseStudy.findByIdAndDelete(id);
      if (!caseStudy) {
        console.log('CaseStudyService: Case study not found for deletion with ID:', id);
        throw new Error('Case study not found');
      }

      console.log('CaseStudyService: Case study deleted successfully:', caseStudy.title);
      return caseStudy;
    } catch (error) {
      console.error('CaseStudyService: Error deleting case study:', error);
      throw new Error(`Failed to delete case study: ${error.message}`);
    }
  }

  static async getPublished() {
    console.log('CaseStudyService: Fetching published case studies');

    try {
      const caseStudies = await CaseStudy.find({ status: 'published' }).sort({ createdAt: -1 });
      console.log(`CaseStudyService: Found ${caseStudies.length} published case studies`);
      return caseStudies;
    } catch (error) {
      console.error('CaseStudyService: Error fetching published case studies:', error);
      throw new Error(`Failed to fetch published case studies: ${error.message}`);
    }
  }

  static async getFeatured() {
    console.log('CaseStudyService: Fetching featured case studies');

    try {
      const caseStudies = await CaseStudy.find({ featured: true, status: 'published' }).sort({ createdAt: -1 });
      console.log(`CaseStudyService: Found ${caseStudies.length} featured case studies`);
      return caseStudies;
    } catch (error) {
      console.error('CaseStudyService: Error fetching featured case studies:', error);
      throw new Error(`Failed to fetch featured case studies: ${error.message}`);
    }
  }
}

module.exports = CaseStudyService;