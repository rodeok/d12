"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Mail, Phone, Calendar, AlertTriangle } from 'lucide-react';

interface Tenant {
  _id: string;
  name: string;
  email: string;
  phone: string;
  rentAmount: number;
  rentStart: string;
  rentEnd: string;
  rentDuration: string;
  propertyId: {
    title: string;
    address: string;
  };
  isActive: boolean;
  createdAt: string;
}

export default function Tenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await fetch('/api/tenants');
      if (response.ok) {
        const data = await response.json();
        setTenants(data);
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRentStatus = (rentEnd: string) => {
    const today = new Date();
    const endDate = new Date(rentEnd);
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return { status: 'expired', color: 'destructive', text: `Expired ${Math.abs(daysUntilExpiry)} days ago` };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'expiring', color: 'secondary', text: `Expires in ${daysUntilExpiry} days` };
    } else {
      return { status: 'active', color: 'default', text: `${daysUntilExpiry} days remaining` };
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tenants</h1>
          <p className="text-gray-600">Manage your tenants and rent agreements</p>
        </div>
        <Link href="/dashboard/tenants/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Tenant
          </Button>
        </Link>
      </div>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map((tenant) => {
          const rentStatus = getRentStatus(tenant.rentEnd);
          
          return (
            <Card key={tenant._id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{tenant.name}</CardTitle>
                    <CardDescription>{tenant.propertyId.title}</CardDescription>
                  </div>
                  <Badge variant={rentStatus.color as any} className="text-xs">
                    {rentStatus.status === 'expired' && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {rentStatus.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {tenant.email}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {tenant.phone}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {rentStatus.text}
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Monthly Rent</span>
                      <span className="text-lg font-semibold">₦{tenant.rentAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Start Date</p>
                      <p className="font-medium">{new Date(tenant.rentStart).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">End Date</p>
                      <p className="font-medium">{new Date(tenant.rentEnd).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3">
                    <Badge variant="outline" className="text-xs">
                      {tenant.rentDuration}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {tenants.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tenants yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first tenant</p>
            <Link href="/dashboard/tenants/new">
              <Button>Add Your First Tenant</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}