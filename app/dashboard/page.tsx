"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Users, Calendar, TrendingUp, MapPin, TriangleAlert as AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalProperties: number;
  totalTenants: number;
  activeTenants: number;
  expiringSoon: number;
  expiredRents: number;
  totalRentIncome: number;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    totalTenants: 0,
    activeTenants: 0,
    expiringSoon: 0,
    expiredRents: 0,
    totalRentIncome: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      const [propertiesRes, tenantsRes] = await Promise.all([
        fetch('/api/properties'),
        fetch('/api/tenants'),
      ]);

      if (propertiesRes.ok && tenantsRes.ok) {
        const properties = await propertiesRes.json();
        const tenants = await tenantsRes.json();

        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        const activeTenants = tenants.filter((tenant: any) => tenant.isActive);
        const expiringSoon = tenants.filter((tenant: any) => {
          const rentEnd = new Date(tenant.rentEnd);
          return rentEnd <= thirtyDaysFromNow && rentEnd > today && tenant.isActive;
        });
        const expiredRents = tenants.filter((tenant: any) => {
          const rentEnd = new Date(tenant.rentEnd);
          return rentEnd < today && tenant.isActive;
        });

        const totalRentIncome = activeTenants.reduce(
          (sum: number, tenant: any) => sum + tenant.rentAmount,
          0
        );

        setStats({
          totalProperties: properties.length,
          totalTenants: tenants.length,
          activeTenants: activeTenants.length,
          expiringSoon: expiringSoon.length,
          expiredRents: expiredRents.length,
          totalRentIncome,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-cormorant font-bold text-4xl text-dark-primary">Welcome back, {session?.user?.name}</h1>
        <p className="font-satoshi text-gray-medium">Here's your property management overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="card-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="ui-label">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-blue-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-cormorant font-bold text-dark-primary">{stats.totalProperties}</div>
            <p className="caption">Properties under management</p>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="ui-label">Active Tenants</CardTitle>
            <Users className="h-4 w-4 text-blue-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-cormorant font-bold text-dark-primary">{stats.activeTenants}</div>
            <p className="caption">
              {stats.totalTenants} total tenants
            </p>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="ui-label">Monthly Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-tertiary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-cormorant font-bold text-dark-primary">₦{stats.totalRentIncome.toLocaleString()}</div>
            <p className="caption">From active tenants</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-300 bg-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="ui-label text-yellow-800">Expiring Soon</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-cormorant font-bold text-yellow-900">{stats.expiringSoon}</div>
            <p className="caption text-yellow-700">Rents expire within 30 days</p>
          </CardContent>
        </Card>

        <Card className="border-red-300 bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="ui-label text-red-800">Expired Rents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-cormorant font-bold text-red-900">{stats.expiredRents}</div>
            <p className="caption text-red-700">Require immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-elegant">
        <CardHeader>
          <CardTitle className="font-cormorant font-semibold text-2xl text-dark-primary">Quick Actions</CardTitle>
          <CardDescription className="font-satoshi text-gray-medium">Manage your properties and tenants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/properties/new">
              <Button className="btn-primary w-full h-16 flex flex-col items-center justify-center space-y-2">
                <Building className="h-5 w-5" />
                <span className="font-satoshi font-medium">Add Property</span>
              </Button>
            </Link>
            
            <Link href="/dashboard/tenants/new">
              <Button className="btn-secondary w-full h-16 flex flex-col items-center justify-center space-y-2">
                <Users className="h-5 w-5" />
                <span className="font-satoshi font-medium">Add Tenant</span>
              </Button>
            </Link>
            
            <Link href="/dashboard/calendar">
              <Button className="btn-secondary w-full h-16 flex flex-col items-center justify-center space-y-2">
                <Calendar className="h-5 w-5" />
                <span className="font-satoshi font-medium">View Calendar</span>
              </Button>
            </Link>
            
            <Link href="/dashboard/map">
              <Button className="btn-secondary w-full h-16 flex flex-col items-center justify-center space-y-2">
                <MapPin className="h-5 w-5" />
                <span className="font-satoshi font-medium">Property Map</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}