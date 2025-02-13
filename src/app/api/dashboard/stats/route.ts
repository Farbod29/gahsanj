import { NextResponse } from 'next/server';
import jalaali from 'jalaali-js';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    // Check if MONGODB_URI exists
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined');
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }

    const client = await clientPromise;
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
