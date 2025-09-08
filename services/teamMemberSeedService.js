const TeamMember = require('../models/TeamMember')

const defaultTeamMembers = [
  {
    name: "Ahmed Al-Rashid",
    position: "CEO & Founder",
    bio: "Former VP at Emirates NBD with 15+ years in fintech",
    image: "/team/ahmed.jpg",
    linkedin: "https://linkedin.com/in/ahmed-alrashid",
    email: "ahmed@almaspay.com",
    order: 0,
    isActive: true,
    isDefault: true
  },
  {
    name: "Sarah Chen",
    position: "CTO",
    bio: "Ex-Google engineer specializing in payment systems",
    image: "/team/sarah.jpg",
    linkedin: "https://linkedin.com/in/sarah-chen",
    email: "sarah@almaspay.com",
    order: 1,
    isActive: true,
    isDefault: true
  },
  {
    name: "Mohammad Hassan",
    position: "Head of Compliance",
    bio: "Former regulatory advisor with deep MENA expertise",
    image: "/team/mohammad.jpg",
    linkedin: "https://linkedin.com/in/mohammad-hassan",
    email: "mohammad@almaspay.com",
    order: 2,
    isActive: true,
    isDefault: true
  },
  {
    name: "Lisa Wang",
    position: "Head of Business Development",
    bio: "20+ years in international trade finance",
    image: "/team/lisa.jpg",
    linkedin: "https://linkedin.com/in/lisa-wang",
    email: "lisa@almaspay.com",
    order: 3,
    isActive: true,
    isDefault: true
  }
]

const seedTeamMembers = async () => {
  try {
    console.log('🌱 Seeding team members...')
    
    // Check if team members already exist
    const existingCount = await TeamMember.countDocuments()
    if (existingCount > 0) {
      console.log(`✅ Team members already exist (${existingCount} found)`)
      return
    }

    // Create default team members
    const createdMembers = await TeamMember.insertMany(defaultTeamMembers)
    console.log(`✅ Created ${createdMembers.length} team members`)
    
    return createdMembers
  } catch (error) {
    console.error('❌ Error seeding team members:', error)
    throw error
  }
}

module.exports = { seedTeamMembers }
