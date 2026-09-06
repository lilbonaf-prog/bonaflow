const User = require('../models/User')

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to load your profile. Please try again.' })
  }
}

const updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const { businessName, phone, address, currency } = req.body

    if (businessName !== undefined) user.businessName = businessName
    if (phone !== undefined) user.phone = phone
    if (address !== undefined) user.address = address
    if (currency !== undefined) user.currency = currency

    await user.save()

    const updatedUser = await User.findById(user._id).select('-password')
    res.json(updatedUser)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to update your profile. Please try again.' })
  }
}

module.exports = { getMe, updateMe }