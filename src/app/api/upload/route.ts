import { NextResponse } from 'next/server';
import cloudinary from '@/utils/cloudinary';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as 'logo' | 'medal';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!type) {
      return NextResponse.json({ error: 'No type specified' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileStr = `data:${file.type};base64,${buffer.toString('base64')}`;

    try {
      // Upload to Cloudinary with specific options
      const result = await cloudinary.uploader.upload(fileStr, {
        folder: 'occasions',
        ...(type === 'logo'
          ? {
              transformation: [
                { width: 100, height: 100, crop: 'fill' },
                { quality: 'auto:good', fetch_format: 'auto' },
                { format: 'png' },
              ],
            }
          : {
              transformation: [
                { width: 800, height: 800, crop: 'limit' },
                { quality: 'auto:good', fetch_format: 'auto' },
                { format: 'jpg' },
              ],
              max_bytes: 200 * 1024, // 200KB limit
            }),
      });

      return NextResponse.json({ url: result.secure_url });
    } catch (cloudinaryError) {
      console.error('Cloudinary upload error:', cloudinaryError);
      return NextResponse.json(
        { error: 'Cloudinary upload failed: ' + cloudinaryError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Upload route error:', error);
    return NextResponse.json(
      {
        error:
          'Error processing upload: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    );
  }
}
