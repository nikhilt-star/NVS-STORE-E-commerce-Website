import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in ENV variables...!')
}

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in ENV variables...!')
}

if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error('CLOUDINARY_CLOUD_NAME is not defined in ENV variables...!')
}

if (!process.env.CLOUDINARY_API_KEY) {
    throw new Error('CLOUDINARY_API_KEY is not defined in ENV variables...!')
}

if (!process.env.CLOUDINARY_SECRET_KEY) {
    throw new Error('CLOUDINARY_SECRET_KEY is not defined in ENV variables...!')
}

const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_SECRET_KEY: process.env.CLOUDINARY_SECRET_KEY
}


export default config;
