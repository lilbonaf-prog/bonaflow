const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const { getReports } = require('../controllers/reportController')

router.use(protect)

router.get('/', getReports)

module.exports = router