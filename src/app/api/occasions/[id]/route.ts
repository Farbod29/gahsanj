import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getUserFromHeaders } from '@/lib/permissions';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const client = new MongoClient(uri);

// GET - Fetch a single occasion
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromHeaders();
    await client.connect();
    const db = client.db('farakhor');
    const collection = db.collection('farakhorCollection');

    const occasion = await collection.findOne({
      _id: new ObjectId(params.id),
    });

    if (!occasion) {
      return NextResponse.json(
        { error: 'Occasion not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(occasion);
  } catch (error) {
    console.error('Error fetching occasion:', error);
    return NextResponse.json(
      { error: 'Failed to fetch occasion' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// PATCH - Update an occasion
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromHeaders();
    const updates = await req.json();

    await client.connect();
    const db = client.db('farakhor');
    const collection = db.collection('farakhorCollection');

    // Remove _id from updates if present
    delete updates._id;

    const result = await collection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Occasion not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Occasion updated successfully' });
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

// DELETE - Delete an occasion
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromHeaders();
    await client.connect();
    const db = client.db('farakhor');
    const collection = db.collection('farakhorCollection');

    const result = await collection.deleteOne({
      _id: new ObjectId(params.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Occasion not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Occasion deleted successfully' });
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
