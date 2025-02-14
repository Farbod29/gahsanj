import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { MongoClient, ObjectId } from 'mongodb';
import { getUserFromHeaders, canManageOccasions } from '@/lib/permissions';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const client = new MongoClient(uri);

const occasionSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.string().transform((str) => new Date(str)),
});

// GET - Fetch occasions
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromHeaders();
    const searchParams = req.nextUrl.searchParams;

    // Parse pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Connect to MongoDB
    await client.connect();
    const db = client.db('farakhor');
    const collection = db.collection('farakhorCollection');

    // Build query
    const query: any = {};

    // Add search filter if provided
    const search = searchParams.get('search');
    if (search) {
      query.$or = [
        { ShortTitle: { $regex: search, $options: 'i' } },
        { EventTitle: { $regex: search, $options: 'i' } },
      ];
    }

    // Add month filter if provided
    const month = searchParams.get('month');
    if (month) {
      query.Month = month;
    }

    // Add important days filter if provided
    const important = searchParams.get('important');
    if (important === 'true') {
      query.importantDay = true;
    }

    // Get total count for pagination
    const totalCount = await collection.countDocuments(query);

    // Fetch paginated occasions
    const occasions = await collection
      .find(query)
      .sort({ Month: 1, PersianDayNumber: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      occasions,
      pagination: {
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        totalItems: totalCount,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/occasions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    // Close the connection
    await client.close();
  }
}

// POST - Create new occasion
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromHeaders();

    if (!canManageOccasions(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await client.connect();
    const db = client.db('farakhor');
    const collection = db.collection('farakhorCollection');

    const body = await req.json();
    const occasion = await collection.insertOne(body);

    return NextResponse.json({
      message: 'Occasion created successfully',
      id: occasion.insertedId,
    });
  } catch (error) {
    console.error('Error creating occasion:', error);
    return NextResponse.json(
      { error: 'Failed to create occasion' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// PATCH - Update occasion
export async function PATCH(req: NextRequest) {
  try {
    await client.connect();
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

    // Convert PersianDayNumber to number if it's present
    if (updates.PersianDayNumber) {
      updates.PersianDayNumber = Number(updates.PersianDayNumber);
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
  } finally {
    await client.close();
  }
}

// DELETE - Delete occasion
export async function DELETE(req: NextRequest) {
  try {
    await client.connect();
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
  } finally {
    await client.close();
  }
}
