import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Tenant from '@/models/Tenant';

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

    const tenants = await Tenant.find({ landlordId: user._id })
      .populate('propertyId', 'title address');
    return NextResponse.json(tenants);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching tenants' }, { status: 500 });
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

    const tenantData = await req.json();
    const tenant = new Tenant({
      ...tenantData,
      landlordId: user._id,
    });

    await tenant.save();
    return NextResponse.json(tenant, { status: 201 });
  } catch (error) {
    console.error('Tenant creation error:', error);
    return NextResponse.json({ message: 'Error creating tenant' }, { status: 500 });
  }
}