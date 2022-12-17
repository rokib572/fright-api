const multer = require('multer')

const uuid = require('uuid').v4
const path = require('path')
const fileUploadMiddleware = (UPLOADS_FOLDER) => {
    // define the storage
    const storage = multer.memoryStorage({
        destination: (req, file, cb) => {
            cb(null, UPLOADS_FOLDER)
        },
        filename: (req, file, cb) => {
            // const fileExt = path.extname(file.originalname)
            const fileName = `${uuid()}-${file.originalname}`
            cb(null, fileName)
        },
    })

    const upload = multer({
        storage,
        limits: {
            fileSize: 1024 * 1024 * 3,
            files: 5,
        },
        fileFilter: (req, file, cb) => {
            if (
                file.mimetype === 'image/png' ||
                file.mimetype === 'image/jpg' ||
                file.mimetype === 'image/jpeg'
            ) {
                cb(null, true)
            } else {
                cb(new Error('Only .jpg, .png or .jpeg format allowed!'))
            }
        },
    })
    return upload
}

module.exports = fileUploadMiddleware
