const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const { createSale, getSales } = require('../controllers/saleController')

router.use(protect)

router.post('/', createSale)
router.get('/', getSales)

module.exports = router