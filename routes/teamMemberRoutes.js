const express = require('express')
const router = express.Router()
const TeamMember = require('../models/TeamMember')
const { requireUser } = require('./middleware/auth')

// Get all team members (public)
router.get('/', async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .select('-__v')
    
    res.json({
      success: true,
      teamMembers
    })
  } catch (error) {
    console.error('Error fetching team members:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching team members',
      error: error.message
    })
  }
})

// Get all team members (admin)
router.get('/admin', requireUser, async (req, res) => {
  try {
    const teamMembers = await TeamMember.find()
      .sort({ order: 1, createdAt: 1 })
      .select('-__v')
    
    res.json({
      success: true,
      teamMembers
    })
  } catch (error) {
    console.error('Error fetching team members admin:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching team members admin',
      error: error.message
    })
  }
})

// Get single team member
router.get('/:id', async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id)
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      })
    }
    
    res.json({
      success: true,
      teamMember
    })
  } catch (error) {
    console.error('Error fetching team member:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching team member',
      error: error.message
    })
  }
})

// Create team member
router.post('/', requireUser, async (req, res) => {
  try {
    const { name, position, bio, image, linkedin, email, order, isActive } = req.body
    
    // Get the next order number if not provided
    let nextOrder = order
    if (nextOrder === undefined || nextOrder === null) {
      const lastMember = await TeamMember.findOne().sort({ order: -1 })
      nextOrder = lastMember ? lastMember.order + 1 : 0
    }
    
    const teamMember = new TeamMember({
      name,
      position,
      bio,
      image: image || '',
      linkedin: linkedin || '',
      email: email || '',
      order: nextOrder,
      isActive: isActive !== undefined ? isActive : true
    })
    
    await teamMember.save()
    
    res.status(201).json({
      success: true,
      message: 'Team member created successfully',
      teamMember
    })
  } catch (error) {
    console.error('Error creating team member:', error)
    res.status(500).json({
      success: false,
      message: 'Error creating team member',
      error: error.message
    })
  }
})

// Update team member
router.put('/:id', requireUser, async (req, res) => {
  try {
    const { name, position, bio, image, linkedin, email, order, isActive } = req.body
    
    const teamMember = await TeamMember.findById(req.params.id)
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      })
    }
    
    // Update fields
    if (name !== undefined) teamMember.name = name
    if (position !== undefined) teamMember.position = position
    if (bio !== undefined) teamMember.bio = bio
    if (image !== undefined) teamMember.image = image
    if (linkedin !== undefined) teamMember.linkedin = linkedin
    if (email !== undefined) teamMember.email = email
    if (order !== undefined) teamMember.order = order
    if (isActive !== undefined) teamMember.isActive = isActive
    
    await teamMember.save()
    
    res.json({
      success: true,
      message: 'Team member updated successfully',
      teamMember
    })
  } catch (error) {
    console.error('Error updating team member:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating team member',
      error: error.message
    })
  }
})

// Delete team member
router.delete('/:id', requireUser, async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id)
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      })
    }
    
    // Don't allow deletion of default team members
    if (teamMember.isDefault) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete default team member'
      })
    }
    
    await TeamMember.findByIdAndDelete(req.params.id)
    
    res.json({
      success: true,
      message: 'Team member deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting team member:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting team member',
      error: error.message
    })
  }
})

// Reorder team members
router.put('/reorder', requireUser, async (req, res) => {
  try {
    const { teamMembers } = req.body
    
    if (!Array.isArray(teamMembers)) {
      return res.status(400).json({
        success: false,
        message: 'Team members must be an array'
      })
    }
    
    // Update order for each team member
    const updatePromises = teamMembers.map((member, index) => 
      TeamMember.findByIdAndUpdate(member._id, { order: index })
    )
    
    await Promise.all(updatePromises)
    
    res.json({
      success: true,
      message: 'Team members reordered successfully'
    })
  } catch (error) {
    console.error('Error reordering team members:', error)
    res.status(500).json({
      success: false,
      message: 'Error reordering team members',
      error: error.message
    })
  }
})

module.exports = router
