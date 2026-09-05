const Customer = require('../models/Customer')

const createCustomer = async (req, res) => {
  try {
    const { fullName, phone, email, address, notes } = req.body

    if (!fullName) {
      return res.status(400).json({ message: 'Please provide the customer\'s name' })
    }

    const customer = await Customer.create({
      user: req.userId,
      fullName,
      phone,
      email,
      address,
      notes
    })

    res.status(201).json(customer)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to save the customer. Please try again.' })
  }
}

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ user: req.userId }).sort({ createdAt: -1 })
    res.json(customers)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to load customers. Please try again.' })
  }
}

const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, user: req.userId })

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    const { fullName, phone, email, address, notes } = req.body

    if (fullName !== undefined) customer.fullName = fullName
    if (phone !== undefined) customer.phone = phone
    if (email !== undefined) customer.email = email
    if (address !== undefined) customer.address = address
    if (notes !== undefined) customer.notes = notes

    await customer.save()
    res.json(customer)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to update the customer. Please try again.' })
  }
}

const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({ _id: req.params.id, user: req.userId })

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    res.json({ message: 'Customer deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to delete the customer. Please try again.' })
  }
}

module.exports = { createCustomer, getCustomers, updateCustomer, deleteCustomer }