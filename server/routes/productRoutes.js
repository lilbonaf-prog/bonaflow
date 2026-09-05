const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const { createProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/productController')

router.use(protect)

router.post('/', createProduct)
router.get('/', getProducts)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

module.exports = router