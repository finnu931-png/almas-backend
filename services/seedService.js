const User = require('../models/User');
const Service = require('../models/Service');
const CaseStudy = require('../models/CaseStudy');
const ContactSubmission = require('../models/ContactSubmission');
const Testimonial = require('../models/Testimonial');
const HomepageSection = require('../models/HomepageSection');
const Logo = require('../models/Logo');
const { seedServiceCategories } = require('./serviceCategorySeedService')
const { seedTeamMembers } = require('./teamMemberSeedService');
const { seedFormFields } = require('./formFieldSeedService');
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

      // Seed Service Categories first
      console.log('SeedService: Seeding service categories...');
      await seedServiceCategories();
      
      // Seed Team Members
      console.log('SeedService: Seeding team members...');
      await seedTeamMembers();
      
      // Seed Form Fields
      console.log('SeedService: Seeding form fields...');
      await seedFormFields();

      // Seed Services
      console.log('SeedService: Seeding services...');
      const services = [
        {
          title: 'Payment Processing',
          description: 'Fast and secure payment processing for trading',
          icon: 'credit-card',
          category: 'Payments & Custody',
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
          title: 'API Integration',
          description: 'Seamless integration with your existing systems',
          icon: 'link',
          category: 'Integration',
          features: ['RESTful APIs', 'Webhook support', 'SDK libraries'],
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
            // subtitle: 'Middle East & Asia',
            ctaPrimary: 'Get Started',
            ctaSecondary: 'Watch Demo'
          }
        },
        {
          title: 'Why Choose',
          content: 'Comprehensive payment solutions built specifically for trading companies operating across Middle East and Asia.',
          sectionType: 'features',
          isActive: true
        },
        {
          title: 'Our Team',
          content: 'Almas pay is led by a strong and diverse team with proven track records in both traditional finance and emerging financial technologies. Collectively, we bring experience from leading global banks, capital markets institutions, and fintech innovators, ensuring a deep understanding of how money and value move across borders.',
          sectionType: 'team-expertise',
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

      // Seed Sample Logos
      console.log('SeedService: Seeding sample logos...');
      const sampleLogos = [
        {
          name: 'Almas Pay Main Logo',
          description: 'Primary logo for website header and main branding',
          imageUrl: 'https://via.placeholder.com/200x60/1e40af/ffffff?text=ALMAS+PAY',
          thumbnailUrl: 'https://via.placeholder.com/100x30/1e40af/ffffff?text=ALMAS+PAY',
          category: 'main',
          isDefault: true,
          isActive: true,
          altText: 'Almas Pay Logo',
          tags: ['main', 'header', 'primary'],
          size: { width: 200, height: 60 }
        },
        {
          name: 'Almas Pay Footer Logo',
          description: 'Logo for website footer',
          imageUrl: 'https://via.placeholder.com/150x45/374151/ffffff?text=ALMAS+PAY',
          thumbnailUrl: 'https://via.placeholder.com/75x22/374151/ffffff?text=ALMAS+PAY',
          category: 'footer',
          isDefault: true,
          isActive: true,
          altText: 'Almas Pay Footer Logo',
          tags: ['footer', 'secondary'],
          size: { width: 150, height: 45 }
        },
        {
          name: 'Almas Pay Favicon',
          description: 'Small icon for browser tabs',
          imageUrl: 'https://via.placeholder.com/32x32/1e40af/ffffff?text=AP',
          thumbnailUrl: 'https://via.placeholder.com/16x16/1e40af/ffffff?text=AP',
          category: 'favicon',
          isDefault: true,
          isActive: true,
          altText: 'Almas Pay Favicon',
          tags: ['favicon', 'icon'],
          size: { width: 32, height: 32 }
        },
        {
          name: 'Almas Pay Admin Logo',
          description: 'Logo for admin panel',
          imageUrl: 'https://via.placeholder.com/180x54/7c3aed/ffffff?text=ALMAS+PAY+ADMIN',
          thumbnailUrl: 'https://via.placeholder.com/90x27/7c3aed/ffffff?text=ADMIN',
          category: 'admin',
          isDefault: true,
          isActive: true,
          altText: 'Almas Pay Admin Logo',
          tags: ['admin', 'dashboard'],
          size: { width: 180, height: 54 }
        },
        {
          name: 'Almas Pay Alternative Logo',
          description: 'Alternative logo design option',
          imageUrl: 'https://via.placeholder.com/200x60/059669/ffffff?text=ALMAS+PAY+ALT',
          thumbnailUrl: 'https://via.placeholder.com/100x30/059669/ffffff?text=ALT',
          category: 'main',
          isDefault: false,
          isActive: true,
          altText: 'Almas Pay Alternative Logo',
          tags: ['alternative', 'option'],
          size: { width: 200, height: 60 }
        }
      ];

      for (const logoData of sampleLogos) {
        const existingLogo = await Logo.findOne({ 
          name: logoData.name,
          category: logoData.category
        });
        if (!existingLogo) {
          await Logo.create(logoData);
          console.log('SeedService: Created logo:', logoData.name);
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