import { NextResponse } from 'next/server';
import jalaali from 'jalaali-js';
import { MongoClient } from 'mongodb';

// Debug logging
console.log('Environment check:', {
  hasMongoDB_URI: !!process.env.MONGODB_URI,
  hasMONGODB_URI: !!process.env.MONGODB_URI,
});

const connectionString = process.env.MONGODB_URI || process.env.MONGODB_URI;
if (!connectionString) {
  throw new Error(
    'Environment variable missing: Please define MONGODB_URI or MONGODB_URI in your Vercel project settings.'
  );
}

// Now you can use `connectionString` for your MongoDB connection.

const uri = process.env.MONGODB_URI as string;
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

function getMonthName(monthNumber: number): string {
  const months = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'امرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
  ];
  return months[monthNumber - 1];
}

export async function GET() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Successfully connected to MongoDB');

    const db = client.db('farakhor');
    const collection = db.collection('farakhorCollection');

    // Get current Persian month
    const today = new Date();
    const { jm: currentMonth } = jalaali.toJalaali(today);

    // Get total occasions count
    const totalOccasions = await collection.countDocuments();

    // Get current month occasions count
    const monthlyOccasions = await collection.countDocuments({
      Month: getMonthName(currentMonth),
    });

    // Get important days count
    const importantDays = await collection.countDocuments({
      importantDay: true,
    });

    return NextResponse.json({
      totalOccasions,
      monthlyOccasions,
      importantDays,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
