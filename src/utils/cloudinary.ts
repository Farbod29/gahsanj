import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dcr52vdzb',
  api_key: process.env.CLOUDINARY_API_KEY || '755746836694391',
  api_secret:
    process.env.CLOUDINARY_API_SECRET || 'SIYNUX93R3zBM-W1d6G_ytW1QnA',
});

export default cloudinary;
