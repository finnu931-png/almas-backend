const mongoose = require('mongoose')

const formFieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  label: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['text', 'email', 'tel', 'select', 'textarea', 'checkbox', 'radio'],
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  options: [{
    label: String,
    value: String
  }],
  validation: {
    minLength: Number,
    maxLength: Number,
    pattern: String
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Index for ordering
formFieldSchema.index({ order: 1 })

module.exports = mongoose.model('FormField', formFieldSchema)
