import { MongoClient, ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env'
  );
}

// GET - Fetch occasions (existing code)
export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('farakhor');
    const collection = db.collection('farakhorCollection');

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');
    const search = searchParams.get('search');
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const important = searchParams.get('important') === 'true';

    // Build query
    let query: any = {};
    if (month) {
      query.Month = month;
    }
    if (important) {
      query.importantDay = true;
    }
    if (search) {
      query.$or = [
        { ShortTitle: { $regex: search, $options: 'i' } },
        { EventTitle: { $regex: search, $options: 'i' } },
        { Text: { $regex: search, $options: 'i' } },
      ];
    }

    // If page and limit are provided, return paginated results
    if (page && limit) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const total = await collection.countDocuments(query);
      const occasions = await collection
        .find(query)
        .sort({ Month: 1, PersianDayNumber: 1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .toArray();

      return NextResponse.json({
        occasions,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    }

    // If no pagination parameters, return all occasions
    const occasions = await collection
      .find(query)
      .sort({ Month: 1, PersianDayNumber: 1 })
      .toArray();

    return NextResponse.json({ occasions });
  } catch (error) {
    console.error('Error fetching occasions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch occasions' },
      { status: 500 }
    );
  }
}

// POST - Create new occasion
export async function POST(req: NextRequest) {
  const client = await clientPromise;

  try {
    const db = client.db('farakhor');
    const collection = db.collection('farakhorCollection');

    const occasion = await req.json();

    // Validate required fields
    const requiredFields = [
      'ShortTitle',
      'EventTitle',
      'Month',
      'PersianDayNumber',
    ];
    for (const field of requiredFields) {
      if (!occasion[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Convert PersianDayNumber and PersianDayNumberK to numbers if they're strings
    occasion.PersianDayNumber = Number(occasion.PersianDayNumber);
    if (occasion.PersianDayNumberK) {
      occasion.PersianDayNumberK = Number(occasion.PersianDayNumberK);
    }

    // Set default values for optional fields
    occasion.importantDay = occasion.importantDay || false;
    occasion.ModalStatus = occasion.ModalStatus || false;

    const result = await collection.insertOne(occasion);

    return NextResponse.json(
      {
        message: 'Occasion created successfully',
        _id: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating occasion:', error);
    return NextResponse.json(
      { error: 'Failed to create occasion' },
      { status: 500 }
    );
  }
}

// PATCH - Update occasion
export async function PATCH(req: NextRequest) {
  const client = await clientPromise;

  try {
    const db = client.db('farakhor');
    const collection = db.collection('farakhorCollection');

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Occasion ID is required' },
        { status: 400 }
      );
    }

    const updates = await req.json();

    // Remove _id from updates if present
    delete updates._id;

    // Convert PersianDayNumber and PersianDayNumberK to numbers if they're present
    if (updates.PersianDayNumber) {
      updates.PersianDayNumber = Number(updates.PersianDayNumber);
    }
    if (updates.PersianDayNumberK) {
      updates.PersianDayNumberK = Number(updates.PersianDayNumberK);
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Occasion not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Occasion updated successfully',
    });
  } catch (error) {
    console.error('Error updating occasion:', error);
    return NextResponse.json(
      { error: 'Failed to update occasion' },
      { status: 500 }
    );
  }
}

// DELETE - Delete occasion
export async function DELETE(req: NextRequest) {
  const client = await clientPromise;

  try {
    const db = client.db('farakhor');
    const collection = db.collection('farakhorCollection');

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Occasion ID is required' },
        { status: 400 }
      );
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Occasion not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Occasion deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting occasion:', error);
    return NextResponse.json(
      { error: 'Failed to delete occasion' },
      { status: 500 }
    );
  }
}
