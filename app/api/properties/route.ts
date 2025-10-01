import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Property from '@/models/Property';

export async function GET(req: NextRequest) {
  await connectDB();

  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Find user by email to get the ID
    const User = require('@/models/User').default;
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const properties = await Property.find({ landlordId: user._id });
    return NextResponse.json(properties);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching properties' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectDB();

  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Find user by email to get the ID
    const User = require('@/models/User').default;
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const propertyData = await req.json();
    const property = new Property({
      ...propertyData,
      landlordId: user._id,
    });

    await property.save();
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Property creation error:', error);
    return NextResponse.json({ message: 'Error creating property' }, { status: 500 });
  }
}