const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    default: 'GHS'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('User', userSchema)