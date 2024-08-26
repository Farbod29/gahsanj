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

    const db = client.db('farakhor');
    const collection = db.collection('farakhorCollection');

    const { pathname } = new URL(req.url);
    const segments = pathname.split('/');
    const month = decodeURIComponent(segments[segments.length - 1]);

    let query = {};

    if (month && month !== 'Farakhor') {
      query = { Month: month };
    }

    let documents;
    try {
      documents = await collection.find(query).toArray();
      if (!documents || documents.length === 0) {
        console.warn(`No documents found for month: ${month}`);
        return NextResponse.json(
          { message: 'No documents found', query },
          { status: 404 }
        );
      }
    } catch (dbError) {
      let errorMessage = 'Unknown database query error';
      if (dbError instanceof Error) {
        errorMessage = dbError.message;
      }
      console.error(
        `Error fetching documents for month: ${month}`,
        errorMessage
      );
      return NextResponse.json(
        { message: 'Database query error', error: errorMessage },
        { status: 500 }
      );
    }

    // Validate and format the Georgian date
    const formattedDocuments = documents.map((doc) => {
      // Check if Georgian is a string
      if (typeof doc.Georgian !== 'string') {
        console.warn(
          `Georgian date is not a string for document with _id: ${doc._id}. Found value:`,
          doc.Georgian
        );
        return {
          ...doc,
          warning: 'Georgian date is not in the correct format',
        };
      }

      const [day, month] = doc.Georgian.split(',');
      const georgianDate = `${parseInt(day)} ${
        [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ][parseInt(month) - 1]
      }`;
      return { ...doc, GeorgianDay: georgianDate };
    });

    if (formattedDocuments.length > 0) {
      return NextResponse.json(formattedDocuments);
    } else {
      console.warn(`No formatted documents found for month: ${month}`);
      return NextResponse.json(
        { message: 'No documents found after formatting', query },
        { status: 404 }
      );
    }
  } catch (error) {
    let errorMessage = 'Unknown server error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('Server error:', errorMessage);
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
