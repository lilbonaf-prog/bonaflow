require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./models/User')
const Product = require('./models/Product')
const Customer = require('./models/Customer')
const Sale = require('./models/Sale')
const Expense = require('./models/Expense')

const DEMO_EMAIL = 'demo@richmondelectronics.com'
const DEMO_PASSWORD = 'Demo@12345'

const paymentMethods = ['Cash', 'Mobile Money', 'Card', 'Bank Transfer']

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomDateInLastDays(days) {
  const now = new Date()
  const past = new Date()
  past.setDate(now.getDate() - randomInt(0, days))
  past.setHours(randomInt(8, 19), randomInt(0, 59), 0, 0)
  return past
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  const existingUser = await User.findOne({ email: DEMO_EMAIL })
  if (existingUser) {
    console.log('Removing existing demo data...')
    await Promise.all([
      Product.deleteMany({ user: existingUser._id }),
      Customer.deleteMany({ user: existingUser._id }),
      Sale.deleteMany({ user: existingUser._id }),
      Expense.deleteMany({ user: existingUser._id }),
      User.deleteOne({ _id: existingUser._id })
    ])
  }

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10)
  const user = await User.create({
    businessName: 'Richmond Electronics',
    email: DEMO_EMAIL,
    password: hashedPassword,
    phone: '0244123456',
    address: '45 Oxford Street, Osu, Accra',
    currency: 'GHS'
  })
  console.log('Created demo user:', user.email)

  const productData = [
    { name: 'Samsung Galaxy A15', costPrice: 950, sellingPrice: 1250, quantity: 40, lowStockThreshold: 5 },
    { name: 'iPhone 13', costPrice: 3200, sellingPrice: 4200, quantity: 15, lowStockThreshold: 5 },
    { name: 'Oraimo Power Bank', costPrice: 90, sellingPrice: 150, quantity: 60, lowStockThreshold: 10 },
    { name: 'USB-C Charger', costPrice: 25, sellingPrice: 45, quantity: 8, lowStockThreshold: 10 },
    { name: 'Bluetooth Speaker', costPrice: 180, sellingPrice: 280, quantity: 25, lowStockThreshold: 5 }
  ]

  const products = await Product.insertMany(
    productData.map((p) => ({ ...p, user: user._id }))
  )
  console.log(`Created ${products.length} products`)

  const customerData = [
    { fullName: 'Kwame Mensah', phone: '0244111222' },
    { fullName: 'Ama Owusu', phone: '0201223344' },
    { fullName: 'Kofi Boateng', phone: '0559988776' },
    { fullName: 'Efua Asante', phone: '0277654321' },
    { fullName: 'Yaw Darko', phone: '0248889900' }
  ]

  const customers = await Customer.insertMany(
    customerData.map((c) => ({ ...c, user: user._id }))
  )
  console.log(`Created ${customers.length} customers`)

  const productStock = {}
  products.forEach((p) => { productStock[p._id.toString()] = p.quantity })

  const salesToCreate = []
  const numberOfSales = 28

  for (let i = 0; i < numberOfSales; i++) {
    const product = products[randomInt(0, products.length - 1)]
    const maxAvailable = productStock[product._id.toString()]
    if (maxAvailable < 1) continue

    const quantity = randomInt(1, Math.min(3, maxAvailable))
    productStock[product._id.toString()] -= quantity

    const useCustomer = Math.random() > 0.3
    const customer = useCustomer ? customers[randomInt(0, customers.length - 1)] : null

    const total = product.sellingPrice * quantity
    const createdAt = randomDateInLastDays(30)

    salesToCreate.push({
      user: user._id,
      customer: customer ? customer._id : null,
      items: [{
        product: product._id,
        name: product.name,
        quantity,
        price: product.sellingPrice
      }],
      total,
      paymentMethod: paymentMethods[randomInt(0, paymentMethods.length - 1)],
      notes: '',
      createdAt,
      updatedAt: createdAt
    })
  }

  salesToCreate.sort((a, b) => a.createdAt - b.createdAt)
  salesToCreate.forEach((sale, index) => {
    sale.receiptNumber = `BF-${String(index + 1).padStart(5, '0')}`
  })

  await Sale.insertMany(salesToCreate)
  console.log(`Created ${salesToCreate.length} sales`)

  for (const product of products) {
    await Product.findByIdAndUpdate(product._id, { quantity: productStock[product._id.toString()] })
  }
  console.log('Updated product stock levels based on sales')

  const expenseTemplates = [
    { description: 'Shop rent - September', category: 'Rent', amount: 2500 },
    { description: 'Electricity bill', category: 'Utilities', amount: 320 },
    { description: 'Water bill', category: 'Utilities', amount: 80 },
    { description: 'Fuel for delivery', category: 'Transport', amount: 150 },
    { description: 'Staff salary - Kojo', category: 'Salaries', amount: 1200 },
    { description: 'Staff salary - Abena', category: 'Salaries', amount: 1100 },
    { description: 'Facebook ads', category: 'Marketing', amount: 200 },
    { description: 'Restocking - phone cases', category: 'Stock', amount: 600 },
    { description: 'Shop cleaning supplies', category: 'Other', amount: 60 },
    { description: 'Delivery motorbike repair', category: 'Transport', amount: 180 }
  ]

  const expensesToCreate = expenseTemplates.map((e) => {
    const createdAt = randomDateInLastDays(30)
    return { ...e, user: user._id, notes: '', createdAt, updatedAt: createdAt }
  })

  await Expense.insertMany(expensesToCreate)
  console.log(`Created ${expensesToCreate.length} expenses`)

  console.log('\nDemo data seeded successfully!')
  console.log('Login with:')
  console.log(`  Email: ${DEMO_EMAIL}`)
  console.log(`  Password: ${DEMO_PASSWORD}`)

  await mongoose.disconnect()
}

seed().catch((error) => {
  console.error('Seeding failed:', error)
  process.exit(1)
})