const ServiceCategory = require('../models/ServiceCategory');

const defaultCategories = [
  {
    name: 'Payments & Custody',
    slug: 'payments-custody',
    description: 'Comprehensive payment processing and secure custody solutions for trading companies',
    icon: 'credit-card',
    color: '#3B82F6',
    order: 0,
    isActive: true,
    isDefault: true
  },
  {
    name: 'FX Management',
    slug: 'fx-management',
    description: 'Advanced foreign exchange management and currency optimization services',
    icon: 'trending-up',
    color: '#10B981',
    order: 1,
    isActive: true,
    isDefault: true
  },
  {
    name: 'Integration',
    slug: 'integration',
    description: 'Seamless API integration and technical implementation services',
    icon: 'link',
    color: '#F59E0B',
    order: 2,
    isActive: true,
    isDefault: true
  }
];

const seedServiceCategories = async () => {
  try {
    console.log('🌱 Starting service categories seeding...');
    
    // Clear existing categories
    await ServiceCategory.deleteMany({});
    console.log('✅ Cleared existing service categories');
    
    // Create default categories
    const createdCategories = await ServiceCategory.insertMany(defaultCategories);
    console.log(`✅ Created ${createdCategories.length} service categories`);
    
    // Log created categories
    createdCategories.forEach(category => {
      console.log(`   - ${category.name} (${category.slug})`);
    });
    
    return {
      success: true,
      message: `Successfully seeded ${createdCategories.length} service categories`,
      categories: createdCategories
    };
  } catch (error) {
    console.error('❌ Error seeding service categories:', error);
    return {
      success: false,
      message: 'Error seeding service categories',
      error: error.message
    };
  }
};

const getServiceCategories = async () => {
  try {
    const categories = await ServiceCategory.find({ isActive: true }).sort({ order: 1 });
    return {
      success: true,
      categories
    };
  } catch (error) {
    console.error('Error fetching service categories:', error);
    return {
      success: false,
      message: 'Error fetching service categories',
      error: error.message
    };
  }
};

module.exports = {
  seedServiceCategories,
  getServiceCategories
};
