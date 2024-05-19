import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const uri = process.env.MONGODB_URI2 || '';
  console.log('MONGODB_URI2:', uri);

  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    console.error('Invalid MongoDB URI:', uri);
    return NextResponse.json(
      { message: 'Configuration error', uri: uri },
      { status: 500 }
    );
  }

  const client = new MongoClient(uri, {});

  try {
    await client.connect();
    const db = client.db('Gahshomari2');
    const collection = db.collection('Farakhor');
    const documents = await collection.find({}).limit(1).toArray();
    return NextResponse.json({ message: 'Connected successfully', documents });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Database connection error:', errorMessage);
    return NextResponse.json(
      { message: 'Server error', error: errorMessage },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
