const mongoose = require('mongoose')

const saleItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
}, { _id: false })

const saleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    default: null
  },
  items: {
    type: [saleItemSchema],
    required: true,
    validate: {
      validator: (items) => items.length > 0,
      message: 'A sale must include at least one product'
    }
  },
  total: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Mobile Money', 'Card', 'Bank Transfer'],
    required: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Sale', saleSchema)