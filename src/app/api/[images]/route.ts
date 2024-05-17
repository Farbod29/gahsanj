// src/app/api/images.ts
import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const uri = process.env.MONGODB_URI || '';
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    console.error('Invalid MongoDB URI:', uri);
    return NextResponse.json(
      { message: 'Configuration error' },
      { status: 500 }
    );
  }

  const client = new MongoClient(uri, {});

  try {
    await client.connect();
    const db = client.db('Ghahshomar');
    const collection = db.collection('AlbumAI');
    const category = req.nextUrl.searchParams.get('category');
    const documents = await collection.find({ category }).toArray();

    if (documents.length > 0) {
      return NextResponse.json(documents);
    } else {
      return NextResponse.json(
        { message: 'No documents found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  } finally {
    await client.close();
  }
}
