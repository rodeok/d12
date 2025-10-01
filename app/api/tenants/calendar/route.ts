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

    const tenants = await Tenant.find({ landlordId: user._id, isActive: true })
      .populate('propertyId', 'title address')
      .select('name email phone rentEnd rentAmount propertyId');

    const calendarEvents = tenants.map(tenant => {
      const today = new Date();
      const rentEndDate = new Date(tenant.rentEnd);
      const daysUntilExpiry = Math.ceil((rentEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      let status = 'active';
      let color = '#22c55e'; // green

      if (daysUntilExpiry < 0) {
        status = 'expired';
        color = '#ef4444'; // red
      } else if (daysUntilExpiry <= 30) {
        status = 'expiring';
        color = '#f59e0b'; // yellow
      }

      return {
        id: tenant._id,
        title: `${tenant.name} - Rent Expires`,
        start: tenant.rentEnd,
        end: tenant.rentEnd,
        allDay: true,
        resource: {
          tenant: tenant,
          property: tenant.propertyId,
          status: status,
          daysUntilExpiry: daysUntilExpiry,
        },
        color: color,
      };
    });

    return NextResponse.json(calendarEvents);
  } catch (error) {
    console.error('Calendar data error:', error);
    return NextResponse.json({ message: 'Error fetching calendar data' }, { status: 500 });
  }
}