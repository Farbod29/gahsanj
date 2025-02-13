import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// تنظیمات Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // آپلود مستقیم به Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: type === 'logo' ? 'logos' : 'medals',
          resource_type: 'auto',
          allowed_formats: ['jpg', 'png', 'webp'],
          transformation: [
            { quality: 'auto:good', fetch_format: 'auto' },
            type === 'logo'
              ? { width: 100, height: 100, crop: 'fill' }
              : { width: 800, crop: 'scale' },
          ],
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      const bufferStream = require('stream').Readable.from(buffer);
      bufferStream.pipe(uploadStream);
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        url: (uploadResult as any).secure_url,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to upload file' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    const publicId = url.split('/').slice(-1)[0].split('.')[0];
    await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
