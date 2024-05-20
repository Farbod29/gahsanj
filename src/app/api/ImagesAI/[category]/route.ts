// src/app/api/ImagesAI/[category]/route.ts

import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import jalaali from 'jalaali-js';

console.log('Initial test log to ensure file is executed');

export async function GET(req: NextRequest) {
  console.log('Environment Variables:', process.env);

  const uri = process.env.MONGODB_URI1 || '';
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    console.error('Invalid MongoDB URI:', uri);
    return NextResponse.json(
      { message: 'Configuration error' },
      { status: 500 }
    );
  }
  console.log('MONGODB_URI1:', uri);

  const client = new MongoClient(uri, {});

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('Ghahshomar');
    const collection = db.collection('AlbumAI');
    const category = decodeURIComponent(
      req.nextUrl.pathname.split('/').pop() || ''
    );
    console.log('Category:', category);

    const today = new Date();
    const jToday = jalaali.toJalaali(today);
    const todayJalali = `${String(jToday.jm).padStart(2, '0')}/${String(
      jToday.jd
    ).padStart(2, '0')}`;
    console.log('Today (Jalali):', todayJalali);

    const documents = await collection
      .find({
        category: { $in: [category, 'general'] },
        $or: [{ activeDates: 'allDays' }, { activeDates: todayJalali }],
      })
      .sort({ order: 1 })
      .toArray();

    console.log('Documents found:', documents);

    if (documents.length > 0) {
      const response = documents.map((doc) => ({
        category: doc.category,
        imagesUrl: doc.imagesUrl,
        activeDates: doc.activeDates,
        order: doc.order,
      }));
      return NextResponse.json(response);
    } else {
      return NextResponse.json(
        { message: 'No documents found' },
        { status: 404 }
      );
    }
  } catch (error: unknown) {
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('Database connection error:', errorMessage);
    return NextResponse.json(
      { message: 'Server error', error: errorMessage },
      { status: 500 }
    );
  } finally {
    console.log('Closing MongoDB connection...');
    await client.close();
    console.log('MongoDB connection closed');
  }
}
