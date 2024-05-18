import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const uri2 = process.env.MONGODB_URI2 || '';
  console.log('MONGODB_URI2:', uri2); // Log the URI to verify it's being loaded

  if (!uri2.startsWith('mongodb://') && !uri2.startsWith('mongodb+srv://')) {
    console.error('Invalid MongoDB URI:', uri2);
    return NextResponse.json(
      { message: 'Configuration error' },
      { status: 500 }
    );
  }

  const client = new MongoClient(uri2, {});

  try {
    await client.connect();
    const db = client.db('Gahshomari2');
    const collection = db.collection('Farakhor');

    const { pathname } = new URL(req.url);
    const segments = pathname.split('/');
    const month = decodeURIComponent(segments[segments.length - 1]);

    let query = {};

    if (month && month !== 'Farakhor') {
      query = { Month: month };
    }

    const documents = await collection.find(query).toArray();

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
