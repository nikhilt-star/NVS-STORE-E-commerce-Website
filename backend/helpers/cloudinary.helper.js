import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import config from '../config/config.js'

cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_SECRET_KEY
})

const storage = new multer.memoryStorage()

async function handleImageUtils(file) {
    try {
        const result = await cloudinary.uploader.upload(file, {
            resource_type: 'auto',
        })
        return result
    } catch (error) {
        console.error('Cloudinary upload error:', error)
        throw error
    }
}

const upload = multer({ storage })

export { handleImageUtils, upload }