const express = require('express')
const router = express.Router()
const FormField = require('../models/FormField')
const { requireUser } = require('./middleware/auth')

// Get all form fields (public)
router.get('/', async (req, res) => {
  try {
    const formFields = await FormField.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .select('-__v')
    
    res.json({
      success: true,
      formFields
    })
  } catch (error) {
    console.error('Error fetching form fields:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching form fields',
      error: error.message
    })
  }
})

// Get all form fields (admin)
router.get('/admin', requireUser, async (req, res) => {
  try {
    const formFields = await FormField.find()
      .sort({ order: 1, createdAt: 1 })
      .select('-__v')
    
    res.json({
      success: true,
      formFields
    })
  } catch (error) {
    console.error('Error fetching form fields admin:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching form fields admin',
      error: error.message
    })
  }
})

// Get single form field
router.get('/:id', async (req, res) => {
  try {
    const formField = await FormField.findById(req.params.id)
    
    if (!formField) {
      return res.status(404).json({
        success: false,
        message: 'Form field not found'
      })
    }
    
    res.json({
      success: true,
      formField
    })
  } catch (error) {
    console.error('Error fetching form field:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching form field',
      error: error.message
    })
  }
})

// Create form field
router.post('/', requireUser, async (req, res) => {
  try {
    const { name, label, type, placeholder, required, options, validation, order, isActive } = req.body
    
    // Get the next order number if not provided
    let nextOrder = order
    if (nextOrder === undefined || nextOrder === null) {
      const lastField = await FormField.findOne().sort({ order: -1 })
      nextOrder = lastField ? lastField.order + 1 : 0
    }
    
    const formField = new FormField({
      name,
      label,
      type,
      placeholder: placeholder || '',
      required: required !== undefined ? required : false,
      options: options || [],
      validation: validation || {},
      order: nextOrder,
      isActive: isActive !== undefined ? isActive : true
    })
    
    await formField.save()
    
    res.status(201).json({
      success: true,
      message: 'Form field created successfully',
      formField
    })
  } catch (error) {
    console.error('Error creating form field:', error)
    res.status(500).json({
      success: false,
      message: 'Error creating form field',
      error: error.message
    })
  }
})

// Update form field
router.put('/:id', requireUser, async (req, res) => {
  try {
    const { name, label, type, placeholder, required, options, validation, order, isActive } = req.body
    
    const formField = await FormField.findById(req.params.id)
    
    if (!formField) {
      return res.status(404).json({
        success: false,
        message: 'Form field not found'
      })
    }
    
    // Update fields
    if (name !== undefined) formField.name = name
    if (label !== undefined) formField.label = label
    if (type !== undefined) formField.type = type
    if (placeholder !== undefined) formField.placeholder = placeholder
    if (required !== undefined) formField.required = required
    if (options !== undefined) formField.options = options
    if (validation !== undefined) formField.validation = validation
    if (order !== undefined) formField.order = order
    if (isActive !== undefined) formField.isActive = isActive
    
    await formField.save()
    
    res.json({
      success: true,
      message: 'Form field updated successfully',
      formField
    })
  } catch (error) {
    console.error('Error updating form field:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating form field',
      error: error.message
    })
  }
})

// Delete form field
router.delete('/:id', requireUser, async (req, res) => {
  try {
    const formField = await FormField.findById(req.params.id)
    
    if (!formField) {
      return res.status(404).json({
        success: false,
        message: 'Form field not found'
      })
    }
    
    // Don't allow deletion of default form fields
    if (formField.isDefault) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete default form field'
      })
    }
    
    await FormField.findByIdAndDelete(req.params.id)
    
    res.json({
      success: true,
      message: 'Form field deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting form field:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting form field',
      error: error.message
    })
  }
})

// Reorder form fields
router.put('/reorder', requireUser, async (req, res) => {
  try {
    const { formFields } = req.body
    
    if (!Array.isArray(formFields)) {
      return res.status(400).json({
        success: false,
        message: 'Form fields must be an array'
      })
    }
    
    // Update order for each form field
    const updatePromises = formFields.map((field, index) => 
      FormField.findByIdAndUpdate(field._id, { order: index })
    )
    
    await Promise.all(updatePromises)
    
    res.json({
      success: true,
      message: 'Form fields reordered successfully'
    })
  } catch (error) {
    console.error('Error reordering form fields:', error)
    res.status(500).json({
      success: false,
      message: 'Error reordering form fields',
      error: error.message
    })
  }
})

module.exports = router
