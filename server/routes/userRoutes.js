const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const upload = require('../middleware/upload')
const { getMe, updateMe, uploadLogo } = require('../controllers/userController')

router.use(protect)

router.get('/me', getMe)
router.put('/me', updateMe)
router.post('/me/logo', upload.single('logo'), uploadLogo)

module.exports = router