const multer = require('multer')
const path = require('path')

const storage = multer.memoryStorage()

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isImageMimetype = file.mimetype.startsWith('image/')
    const extension = path.extname(file.originalname).toLowerCase()
    const isImageExtension = allowedExtensions.includes(extension)

    if (isImageMimetype || isImageExtension) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  }
})

module.exports = upload