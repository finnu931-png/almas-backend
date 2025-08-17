const ContactSubmission = require('../models/ContactSubmission');
const EmailService = require('./emailService');

class ContactService {
  static async create(contactData) {
    try {
      console.log('ContactService: Creating new contact submission for:', contactData.email);
      
      const submission = new ContactSubmission(contactData);
      const savedSubmission = await submission.save();

      console.log('ContactService: Contact submission created with ID:', savedSubmission._id);

      // Send email notification (if email service is configured)
      try {
        await EmailService.sendContactNotification(savedSubmission);
        console.log('ContactService: Email notification sent successfully');
      } catch (emailError) {
        console.log('ContactService: Email notification failed (continuing):', emailError.message);
      }

      return savedSubmission;
    } catch (error) {
      console.error('ContactService: Error creating contact submission:', error);
      throw error;
    }
  }

  static async getAll(filters = {}) {
    try {
      console.log('ContactService: Fetching all contact submissions with filters:', filters);
      
      const query = { ...filters };
      const submissions = await ContactSubmission.find(query)
        .sort({ createdAt: -1 })
        .populate('assignedTo', 'firstName lastName email');

      console.log('ContactService: Found', submissions.length, 'contact submissions');
      return submissions;
    } catch (error) {
      console.error('ContactService: Error fetching contact submissions:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      console.log('ContactService: Fetching contact submission by ID:', id);
      
      const submission = await ContactSubmission.findById(id)
        .populate('assignedTo', 'firstName lastName email');

      if (!submission) {
        console.log('ContactService: Contact submission not found with ID:', id);
        return null;
      }

      console.log('ContactService: Contact submission found for:', submission.email);
      return submission;
    } catch (error) {
      console.error('ContactService: Error fetching contact submission by ID:', error);
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      console.log('ContactService: Updating contact submission with ID:', id);
      console.log('ContactService: Update data:', updateData);

      // Set resolvedAt if status is being changed to resolved
      if (updateData.status === 'resolved' && !updateData.resolvedAt) {
        updateData.resolvedAt = new Date();
      }

      // Set resolvedAt if status is being changed to closed-won or closed-lost
      if ((updateData.status === 'closed-won' || updateData.status === 'closed-lost') && !updateData.resolvedAt) {
        updateData.resolvedAt = new Date();
      }

      const submission = await ContactSubmission.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: Date.now() },
        { new: true, runValidators: true }
      ).populate('assignedTo', 'firstName lastName email');

      if (!submission) {
        console.log('ContactService: Contact submission not found for update with ID:', id);
        return null;
      }

      console.log('ContactService: Contact submission updated successfully for:', submission.email);
      return submission;
    } catch (error) {
      console.error('ContactService: Error updating contact submission:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      console.log('ContactService: Deleting contact submission with ID:', id);
      
      const submission = await ContactSubmission.findByIdAndDelete(id);

      if (!submission) {
        console.log('ContactService: Contact submission not found for deletion with ID:', id);
        return null;
      }

      console.log('ContactService: Contact submission deleted successfully for:', submission.email);
      return submission;
    } catch (error) {
      console.error('ContactService: Error deleting contact submission:', error);
      throw error;
    }
  }

  static async getStats() {
    try {
      console.log('ContactService: Fetching contact statistics');
      
      const totalSubmissions = await ContactSubmission.countDocuments();
      const newSubmissions = await ContactSubmission.countDocuments({ status: 'new' });
      const qualifiedSubmissions = await ContactSubmission.countDocuments({ status: 'qualified' });
      const proposalSubmissions = await ContactSubmission.countDocuments({ status: 'proposal' });
      const closedWonSubmissions = await ContactSubmission.countDocuments({ status: 'closed-won' });
      const closedLostSubmissions = await ContactSubmission.countDocuments({ status: 'closed-lost' });

      // Get submissions from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentSubmissions = await ContactSubmission.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
      });

      const stats = {
        total: totalSubmissions,
        new: newSubmissions,
        qualified: qualifiedSubmissions,
        proposal: proposalSubmissions,
        closedWon: closedWonSubmissions,
        closedLost: closedLostSubmissions,
        recent: recentSubmissions,
        // Legacy stats for backward compatibility
        inProgress: await ContactSubmission.countDocuments({ status: 'in-progress' }),
        resolved: await ContactSubmission.countDocuments({ status: 'resolved' })
      };

      console.log('ContactService: Contact statistics:', stats);
      return stats;
    } catch (error) {
      console.error('ContactService: Error fetching contact statistics:', error);
      throw error;
    }
  }
}

module.exports = ContactService;