const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const { createCustomer, getCustomers, updateCustomer, deleteCustomer } = require('../controllers/customerController')

router.use(protect)

router.post('/', createCustomer)
router.get('/', getCustomers)
router.put('/:id', updateCustomer)
router.delete('/:id', deleteCustomer)

module.exports = router