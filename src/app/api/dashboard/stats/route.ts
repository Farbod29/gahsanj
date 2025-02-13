import { NextResponse } from 'next/server';
import jalaali from 'jalaali-js';
import { MongoClient } from 'mongodb';

// Debug logging
console.log('Environment check:', {
  hasMongoDB_URI: !!process.env.MONGODB_URI,
  hasDatabase_URL: !!process.env.DATABASE_URL
});

if (!process.env.MONGODB_URI && !process.env.DATABASE_URL) {
  throw new Error(
    'Please define the MONGODB_URI or DATABASE_URL environment variable'
  );
}

const uri = process.env.MONGODB_URI || process.env.DATABASE_URL;

export async function GET() {
  let client: MongoClient | null = null;

  try {
    console.log('Attempting to connect to MongoDB...');
    client = new MongoClient(uri!);
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
    console.error('Error fetching dashboard stats:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      uri: uri?.split('@')[1], // Log only the host part of URI for security
    });
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}

function getMonthName(month: number): string {
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
  return months[month - 1];
}
