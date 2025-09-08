const FormField = require('../models/FormField')

const defaultFormFields = [
  {
    name: 'fullName',
    label: 'Full Name',
    type: 'text',
    placeholder: 'Your full name',
    required: true,
    options: [],
    validation: {
      minLength: 2,
      maxLength: 100
    },
    order: 0,
    isActive: true,
    isDefault: true
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'your@email.com',
    required: true,
    options: [],
    validation: {
      pattern: '^[^@]+@[^@]+\\.[^@]+$'
    },
    order: 1,
    isActive: true,
    isDefault: true
  },
  {
    name: 'companyName',
    label: 'Company Name',
    type: 'text',
    placeholder: 'Your company name',
    required: true,
    options: [],
    validation: {
      minLength: 2,
      maxLength: 100
    },
    order: 2,
    isActive: true,
    isDefault: true
  },
  {
    name: 'phoneNumber',
    label: 'Phone Number',
    type: 'tel',
    placeholder: '+971-50-123-4567',
    required: false,
    options: [],
    validation: {
      pattern: '^[+]?[0-9\\s\\-()]+$'
    },
    order: 3,
    isActive: true,
    isDefault: true
  },
  {
    name: 'subject',
    label: 'Subject',
    type: 'select',
    placeholder: 'Select a subject',
    required: true,
    options: [
      { label: 'General Inquiry', value: 'general' },
      { label: 'Sales Question', value: 'sales' },
      { label: 'Technical Support', value: 'support' },
      { label: 'Partnership', value: 'partnership' },
      { label: 'Other', value: 'other' }
    ],
    validation: {},
    order: 4,
    isActive: true,
    isDefault: true
  },
  {
    name: 'urgencyLevel',
    label: 'Urgency Level',
    type: 'select',
    placeholder: 'Select urgency',
    required: false,
    options: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
      { label: 'Urgent', value: 'urgent' }
    ],
    validation: {},
    order: 5,
    isActive: true,
    isDefault: true
  },
  {
    name: 'preferredContactMethod',
    label: 'Preferred Contact Method',
    type: 'select',
    placeholder: 'How would you like us to contact you?',
    required: false,
    options: [
      { label: 'Email', value: 'email' },
      { label: 'Phone Call', value: 'phone' },
      { label: 'WhatsApp', value: 'whatsapp' },
      { label: 'Video Call', value: 'video' }
    ],
    validation: {},
    order: 6,
    isActive: true,
    isDefault: true
  },
  {
    name: 'message',
    label: 'Message',
    type: 'textarea',
    placeholder: 'Tell us more about your inquiry...',
    required: true,
    options: [],
    validation: {
      minLength: 10,
      maxLength: 1000
    },
    order: 7,
    isActive: true,
    isDefault: true
  }
]

const seedFormFields = async () => {
  try {
    console.log('🌱 Seeding form fields...')
    
    // Check if form fields already exist
    const existingCount = await FormField.countDocuments()
    if (existingCount > 0) {
      console.log(`✅ Form fields already exist (${existingCount} found)`)
      return
    }

    // Create default form fields
    const createdFields = await FormField.insertMany(defaultFormFields)
    console.log(`✅ Created ${createdFields.length} form fields`)
    
    return createdFields
  } catch (error) {
    console.error('❌ Error seeding form fields:', error)
    throw error
  }
}

module.exports = { seedFormFields }
