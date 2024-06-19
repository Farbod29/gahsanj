import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export interface Occasion {
  _id: {
    $oid: string;
  };
  Month: string;
  DayNumber: number;
  PersianDayNumber: string;
  Georgian: string;
  GeorgianDay?: string;
  EventTitle: string;
  ShortTitle: string;
  ModalStatus: boolean;
  Text: string;
  ModalImageLink: string;
  Logo: string;
}

const uri2 = process.env.MONGODB_URI2 || '';

if (!uri2.startsWith('mongodb://') && !uri2.startsWith('mongodb+srv://')) {
  console.error('Invalid MongoDB URI:', uri2);
}

const client = new MongoClient(uri2);

export async function GET(req: NextRequest) {
  try {
    await client.connect();
    const db = client.db('farakhor');
    const collection = db.collection<Occasion>('farakhorCollection');

    // Get today's date in Gregorian format
    const today = new Date();
    const todayDay = today.getDate().toString().padStart(2, '0'); // Pad day with leading zero if needed
    const todayMonth = (today.getMonth() + 1).toString().padStart(2, '0'); // Pad month with leading zero if needed
    const todayGeorgian = `${todayDay},${todayMonth}`;

    // Find documents that match today's date
    const documents = await collection
      .find({ Georgian: todayGeorgian })
      .toArray();

    // Extract the ShortTitles
    const shortTitles = documents.map((doc) => doc.ShortTitle);

    if (shortTitles.length > 0) {
      return NextResponse.json(shortTitles);
    } else {
      return NextResponse.json(
        { message: 'No documents found for today' },
        { status: 404 }
      );
    }
  } catch (error) {
    const errorMessage = (error as Error).message || 'Unknown error';
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
