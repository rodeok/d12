import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

function verifyAdminToken(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const admin = verifyAdminToken(req);
    
    if (!admin || (admin as any).role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = verifyAdminToken(req);
    
    if (!admin || (admin as any).role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { userId, action } = await req.json();
    
    let update = {};
    if (action === 'ban') {
      update = { isBanned: true, isActive: false };
    } else if (action === 'unban') {
      update = { isBanned: false, isActive: true };
    }

    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select('-password');
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = verifyAdminToken(req);
    
    if (!admin || (admin as any).role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { userId } = await req.json();
    
    // Also delete user's properties and tenants
    const Property = require('@/models/Property').default;
    const Tenant = require('@/models/Tenant').default;
    
    await Property.deleteMany({ landlordId: userId });
    await Tenant.deleteMany({ landlordId: userId });
    await User.findByIdAndDelete(userId);
    
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Error deleting user' }, { status: 500 });
  }
}