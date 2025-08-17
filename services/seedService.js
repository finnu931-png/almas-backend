const User = require('../models/User');
const Service = require('../models/Service');
const CaseStudy = require('../models/CaseStudy');
const ContactSubmission = require('../models/ContactSubmission');
const Testimonial = require('../models/Testimonial');
const HomepageSection = require('../models/HomepageSection');
const { hashPassword } = require('../utils/password');

class SeedService {
  static async seedAdminUser() {
    try {
      console.log('SeedService: Checking if admin user already exists...');
      
      // Check if admin user already exists
      const existingAdmin = await User.findOne({ email: 'admin@example.com' });
      if (existingAdmin) {
        console.log('SeedService: Admin user already exists');
        return { message: 'Admin user already exists', user: existingAdmin };
      }

      console.log('SeedService: Creating admin user...');
      
      // Create admin user
      const hashedPassword = await hashPassword('admin123');
      const adminUser = new User({
        email: 'admin@example.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
        emailVerified: true
      });

      const savedAdmin = await adminUser.save();
      console.log('SeedService: Admin user created successfully with ID:', savedAdmin._id);

      return { message: 'Admin user created successfully', user: savedAdmin };
    } catch (error) {
      console.error('SeedService: Error seeding admin user:', error);
      throw error;
    }
  }

  static async seedSampleData() {
    try {
      console.log('SeedService: Starting to seed sample data...');

      // Seed Services
      console.log('SeedService: Seeding services...');
      const services = [
        {
          title: 'Payment Processing',
          description: 'Fast and secure payment processing for trading companies',
          icon: 'credit-card',
          category: 'Payment Processing',
          features: ['Real-time processing', 'Multi-currency support', 'Fraud protection'],
          pricing: 'From 0.5%',
          status: 'published'
        },
        {
          title: 'FX Management',
          description: 'Optimize foreign exchange rates and reduce costs',
          icon: 'trending-up',
          category: 'FX Management',
          features: ['Competitive rates', 'Risk management', 'Real-time quotes'],
          pricing: 'From 0.3%',
          status: 'published'
        },
        {
          title: 'Compliance & KYC',
          description: 'Automated compliance checks and KYC verification',
          icon: 'shield-check',
          category: 'Compliance',
          features: ['Automated KYC', 'AML screening', 'Regulatory reporting'],
          pricing: 'Contact for pricing',
          status: 'published'
        }
      ];

      for (const serviceData of services) {
        const existingService = await Service.findOne({ title: serviceData.title });
        if (!existingService) {
          await Service.create(serviceData);
          console.log('SeedService: Created service:', serviceData.title);
        }
      }

      // Seed Case Studies
      console.log('SeedService: Seeding case studies...');
      const caseStudies = [
        {
          title: 'Gulf Trading Co. - 80% Faster Settlements',
          description: 'How we helped Gulf Trading Co. reduce settlement times',
          clientName: 'Gulf Trading Co.',
          industry: 'Commodities Trading',
          challenge: 'Manual payment processes causing 5-day settlement delays',
          solution: 'Implemented automated payment processing with real-time FX optimization',
          results: 'Reduced settlement time from 5 days to 4 hours, 60% reduction in FX costs',
          status: 'published',
          metrics: [
            { label: 'Settlement Time', value: '4 hours', improvement: '80% faster' },
            { label: 'FX Savings', value: '60%', improvement: 'cost reduction' }
          ]
        }
      ];

      for (const caseStudyData of caseStudies) {
        const existingCaseStudy = await CaseStudy.findOne({ title: caseStudyData.title });
        if (!existingCaseStudy) {
          await CaseStudy.create(caseStudyData);
          console.log('SeedService: Created case study:', caseStudyData.title);
        }
      }

      // Seed Testimonials
      console.log('SeedService: Seeding testimonials...');
      const testimonials = [
        {
          authorName: 'Ahmed Al-Rashid',
          authorPosition: 'CFO',
          authorCompany: 'Gulf Trading Co.',
          content: 'Almas Pay reduced our settlement times by 80% and saved us thousands in FX fees.',
          rating: 5,
          isActive: true
        },
        {
          authorName: 'Sarah Chen',
          authorPosition: 'Finance Director',
          authorCompany: 'Asia Pacific Imports',
          content: 'The compliance automation features have streamlined our entire payment process.',
          rating: 5,
          isActive: true
        }
      ];

      for (const testimonialData of testimonials) {
        const existingTestimonial = await Testimonial.findOne({ 
          authorName: testimonialData.authorName,
          authorCompany: testimonialData.authorCompany
        });
        if (!existingTestimonial) {
          await Testimonial.create(testimonialData);
          console.log('SeedService: Created testimonial for:', testimonialData.authorName);
        }
      }

      // Seed Homepage Sections
      console.log('SeedService: Seeding homepage sections...');
      const homepageSections = [
        {
          title: 'Streamline Your Trading Payments Across Middle East & Asia',
          content: 'Licensed Payment Service Provider enabling fast, secure, and compliant cross-border transactions for trading companies',
          sectionType: 'hero',
          isActive: true,
          metadata: {
            subtitle: 'Middle East & Asia',
            ctaPrimary: 'Get Started',
            ctaSecondary: 'Watch Demo'
          }
        },
        {
          title: 'Why Choose Almas Pay?',
          content: 'Comprehensive payment solutions built specifically for trading companies operating across Middle East and Asia.',
          sectionType: 'features',
          isActive: true
        }
      ];

      for (const sectionData of homepageSections) {
        const existingSection = await HomepageSection.findOne({ 
          sectionType: sectionData.sectionType
        });
        if (!existingSection) {
          await HomepageSection.create(sectionData);
          console.log('SeedService: Created homepage section:', sectionData.sectionType);
        }
      }

      console.log('SeedService: Sample data seeding completed successfully');
      return { message: 'Sample data seeded successfully' };
    } catch (error) {
      console.error('SeedService: Error seeding sample data:', error);
      throw error;
    }
  }

  static async clearSampleData() {
    try {
      console.log('SeedService: Clearing sample data...');
      
      await Service.deleteMany({});
      await CaseStudy.deleteMany({});
      await ContactSubmission.deleteMany({});
      await Testimonial.deleteMany({});
      await HomepageSection.deleteMany({});
      
      console.log('SeedService: Sample data cleared successfully');
      return { message: 'Sample data cleared successfully' };
    } catch (error) {
      console.error('SeedService: Error clearing sample data:', error);
      throw error;
    }
  }
}

module.exports = SeedService;