import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request: NextRequest, { params }: any) {
  const { id } = params;
  try {
    const occasion = await prisma.occasion.findUnique({
      where: { id: id },
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
  }
}

export async function PUT(request: NextRequest, { params }: any) {
  try {
    const { id } = params;
    const data = await request.json();

    const updatedOccasion = await prisma.occasion.update({
      where: { id: id },
      data,
    });

    return NextResponse.json(updatedOccasion);
  } catch (error) {
    console.error('Error updating occasion:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: any) {
  try {
    const { id } = params;

    await prisma.occasion.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: 'Occasion deleted successfully' });
  } catch (error) {
    console.error('Error deleting occasion:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
