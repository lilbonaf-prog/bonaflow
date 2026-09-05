const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const register = async (req, res) => {
  try {
    const { businessName, email, password } = req.body

    if (!businessName || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      businessName,
      email,
      password: hashedPassword
    })

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      token,
      user: {
        id: user._id,
        businessName: user.businessName,
        email: user.email,
        currency: user.currency
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to create account. Please try again.' })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter your email and password' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const passwordMatches = await bcrypt.compare(password, user.password)
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user._id,
        businessName: user.businessName,
        email: user.email,
        currency: user.currency
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to log in. Please try again.' })
  }
}

module.exports = { register, login }