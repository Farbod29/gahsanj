// app/api/barjaste/route.ts
import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const uri2 = process.env.MONGODB_URI2 || '';

  if (!uri2.startsWith('mongodb://') && !uri2.startsWith('mongodb+srv://')) {
    console.error('Invalid MongoDB URI:', uri2);
    return NextResponse.json(
      { message: 'Configuration error', uri: uri2 },
      { status: 500 }
    );
  }

  const client = new MongoClient(uri2);

  try {
    await client.connect();

    const db = client.db('Gahshomari2');
    const collection = db.collection('Farakhor');

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const query = { date: todayStr, type: 'برجسته' };

    const documents = await collection.find(query).toArray();

    if (documents.length > 0) {
      return NextResponse.json(documents);
    } else {
      return NextResponse.json(
        { message: 'No events found', query },
        { status: 404 }
      );
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Database connection error:', errorMessage);
    return NextResponse.json(
      { message: 'Server error', error: errorMessage },
      { status: 500 }
    );
  } finally {
    try {
      await client.close();
    } catch (closeError) {
      console.error('Error closing MongoDB connection:', closeError);
    }
  }
}

export default GET;
