require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')

connectDB()

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL
].filter(Boolean)

app.use(cors({
  origin: allowedOrigins
}))
app.use(express.json())

const userRoutes = require('./routes/userRoutes')
app.use('/api/users', userRoutes)

const reportRoutes = require('./routes/reportRoutes')
app.use('/api/reports', reportRoutes)

const dashboardRoutes = require('./routes/dashboardRoutes')
app.use('/api/dashboard', dashboardRoutes)

const expenseRoutes = require('./routes/expenseRoutes')
app.use('/api/expenses', expenseRoutes)

const saleRoutes = require('./routes/saleRoutes')
app.use('/api/sales', saleRoutes)

const customerRoutes = require('./routes/customerRoutes')
app.use('/api/customers', customerRoutes)

const productRoutes = require('./routes/productRoutes')
app.use('/api/products', productRoutes)

const authRoutes = require('./routes/authRoutes')
app.use('/api/auth', authRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'BonaFlow server is running' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})