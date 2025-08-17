const Testimonial = require('../models/Testimonial');

class TestimonialService {
  static async create(testimonialData) {
    try {
      console.log('TestimonialService: Creating new testimonial for author:', testimonialData.authorName);
      const testimonial = new Testimonial(testimonialData);
      const savedTestimonial = await testimonial.save();
      console.log('TestimonialService: Testimonial created successfully with ID:', savedTestimonial._id);
      return savedTestimonial;
    } catch (error) {
      console.error('TestimonialService: Error creating testimonial:', error.message);
      throw error;
    }
  }

  static async getAll(filters = {}) {
    try {
      console.log('TestimonialService: Fetching all testimonials with filters:', filters);
      const query = { ...filters };
      const testimonials = await Testimonial.find(query).sort({ displayOrder: 1, createdAt: -1 });
      console.log('TestimonialService: Found', testimonials.length, 'testimonials');
      return testimonials;
    } catch (error) {
      console.error('TestimonialService: Error fetching testimonials:', error.message);
      throw error;
    }
  }

  static async getById(id) {
    try {
      console.log('TestimonialService: Fetching testimonial by ID:', id);
      const testimonial = await Testimonial.findById(id);
      if (!testimonial) {
        console.log('TestimonialService: Testimonial not found with ID:', id);
        return null;
      }
      console.log('TestimonialService: Testimonial found for author:', testimonial.authorName);
      return testimonial;
    } catch (error) {
      console.error('TestimonialService: Error fetching testimonial by ID:', error.message);
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      console.log('TestimonialService: Updating testimonial with ID:', id);
      const testimonial = await Testimonial.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      if (!testimonial) {
        console.log('TestimonialService: Testimonial not found for update with ID:', id);
        return null;
      }
      console.log('TestimonialService: Testimonial updated successfully for author:', testimonial.authorName);
      return testimonial;
    } catch (error) {
      console.error('TestimonialService: Error updating testimonial:', error.message);
      throw error;
    }
  }

  static async delete(id) {
    try {
      console.log('TestimonialService: Deleting testimonial with ID:', id);
      const testimonial = await Testimonial.findByIdAndDelete(id);
      if (!testimonial) {
        console.log('TestimonialService: Testimonial not found for deletion with ID:', id);
        return null;
      }
      console.log('TestimonialService: Testimonial deleted successfully for author:', testimonial.authorName);
      return testimonial;
    } catch (error) {
      console.error('TestimonialService: Error deleting testimonial:', error.message);
      throw error;
    }
  }

  static async getActive() {
    try {
      console.log('TestimonialService: Fetching active testimonials');
      const testimonials = await Testimonial.find({ isActive: true }).sort({ displayOrder: 1, rating: -1 });
      console.log('TestimonialService: Found', testimonials.length, 'active testimonials');
      return testimonials;
    } catch (error) {
      console.error('TestimonialService: Error fetching active testimonials:', error.message);
      throw error;
    }
  }
}

module.exports = TestimonialService;