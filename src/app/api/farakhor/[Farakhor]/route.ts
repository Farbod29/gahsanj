import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  console.log('MONGODB_URI2:', process.env.MONGODB_URI2);
  const uri2 = process.env.MONGODB_URI2 || '';
  console.log('MONGODB_URI2:', uri2); // Log the URI to verify it's being loaded

  if (!uri2.startsWith('mongodb://') && !uri2.startsWith('mongodb+srv://')) {
    console.error('Invalid MongoDB URI:', uri2);
    return NextResponse.json(
      { message: 'Configuration error', uri: uri2 },
      { status: 500 }
    );
  }

  const client = new MongoClient(uri2, {});

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('Gahshomari2');
    const collection = db.collection('Farakhor');

    const { pathname } = new URL(req.url);
    const segments = pathname.split('/');
    const month = decodeURIComponent(segments[segments.length - 1]);
    console.log('Month:', month);

    let query = {};

    if (month && month !== 'Farakhor') {
      query = { Month: month };
    }

    console.log('Query:', query);
    const documents = await collection.find(query).toArray();
    console.log('Documents found:', documents.length);

    if (documents.length > 0) {
      return NextResponse.json(documents);
    } else {
      return NextResponse.json(
        { message: 'No documents found', query },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  } finally {
    try {
      console.log('Closing MongoDB connection...');
      await client.close();
      console.log('MongoDB connection closed');
    } catch (closeError) {
      console.error('Error closing MongoDB connection:', closeError);
    }
  }
}
