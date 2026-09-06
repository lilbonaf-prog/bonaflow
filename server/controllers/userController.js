const User = require('../models/User')
const cloudinary = require('../config/cloudinary')

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

const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please select an image to upload' })
    }

    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'bonaflow-logos',
      transformation: [{ width: 400, height: 400, crop: 'limit' }]
    })

    const user = await User.findById(req.userId)
    user.logoUrl = result.secure_url
    await user.save()

    const updatedUser = await User.findById(user._id).select('-password')
    res.json(updatedUser)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to upload the logo. Please try again.' })
  }
}

module.exports = { getMe, updateMe, uploadLogo }