const Product = require('../models/Product')

const createProduct = async (req, res) => {
  try {
    const { name, costPrice, sellingPrice, quantity, lowStockThreshold } = req.body

    if (!name || costPrice === undefined || sellingPrice === undefined) {
      return res.status(400).json({ message: 'Please provide a name, cost price and selling price' })
    }

    const product = await Product.create({
      user: req.userId,
      name,
      costPrice,
      sellingPrice,
      quantity: quantity || 0,
      lowStockThreshold: lowStockThreshold || 5
    })

    res.status(201).json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to save the product. Please try again.' })
  }
}

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.userId }).sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to load products. Please try again.' })
  }
}

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, user: req.userId })

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const { name, costPrice, sellingPrice, quantity, lowStockThreshold, imageUrl } = req.body

    if (name !== undefined) product.name = name
    if (costPrice !== undefined) product.costPrice = costPrice
    if (sellingPrice !== undefined) product.sellingPrice = sellingPrice
    if (quantity !== undefined) product.quantity = quantity
    if (lowStockThreshold !== undefined) product.lowStockThreshold = lowStockThreshold
    if (imageUrl !== undefined) product.imageUrl = imageUrl

    await product.save()
    res.json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to update the product. Please try again.' })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, user: req.userId })

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to delete the product. Please try again.' })
  }
}

module.exports = { createProduct, getProducts, updateProduct, deleteProduct }