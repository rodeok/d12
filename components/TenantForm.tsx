"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';

interface Property {
  _id: string;
  title: string;
  address: string;
}

interface TenantFormData {
  propertyId: string;
  name: string;
  email: string;
  phone: string;
  rentAmount: number;
  rentStart: string;
  rentDuration: string;
  notes: string;
}

export default function TenantForm() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState('');

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<TenantFormData>();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const calculateRentEnd = (startDate: string, duration: string): string => {
    const start = new Date(startDate);
    const [amount, unit] = duration.split(' ');
    const months = unit.includes('year') ? parseInt(amount) * 12 : parseInt(amount);
    
    const endDate = new Date(start);
    endDate.setMonth(endDate.getMonth() + months);
    
    return endDate.toISOString().split('T')[0];
  };

  const onSubmit = async (data: TenantFormData) => {
    setLoading(true);

    try {
      const rentEnd = calculateRentEnd(data.rentStart, data.rentDuration);
      
      const tenantData = {
        ...data,
        rentEnd,
        lastPaymentDate: data.rentStart,
      };

      const response = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tenantData),
      });

      if (response.ok) {
        toast.success('Tenant added successfully!');
        router.push('/dashboard/tenants');
      } else {
        toast.error('Failed to add tenant');
      }
    } catch (error) {
      toast.error('An error occurred while adding the tenant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Tenant</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="propertyId">Select Property*</Label>
            <Select value={selectedProperty} onValueChange={(value) => {
              setSelectedProperty(value);
              setValue('propertyId', value);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property._id} value={property._id}>
                    {property.title} - {property.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.propertyId && (
              <p className="text-red-500 text-sm mt-1">Please select a property</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Tenant Name*</Label>
              <Input
                id="name"
                {...register('name', { required: 'Tenant name is required' })}
                placeholder="Enter tenant name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address'
                  }
                })}
                placeholder="Enter tenant email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="phone">Phone Number*</Label>
              <Input
                id="phone"
                {...register('phone', { required: 'Phone number is required' })}
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="rentAmount">Rent Amount*</Label>
              <Input
                id="rentAmount"
                type="number"
                {...register('rentAmount', { 
                  required: 'Rent amount is required',
                  valueAsNumber: true,
                  min: { value: 1, message: 'Rent amount must be greater than 0' }
                })}
                placeholder="Enter rent amount"
              />
              {errors.rentAmount && (
                <p className="text-red-500 text-sm mt-1">{errors.rentAmount.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="rentStart">Rent Start Date*</Label>
              <Input
                id="rentStart"
                type="date"
                {...register('rentStart', { required: 'Rent start date is required' })}
              />
              {errors.rentStart && (
                <p className="text-red-500 text-sm mt-1">{errors.rentStart.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="rentDuration">Rent Duration*</Label>
              <Select onValueChange={(value) => setValue('rentDuration', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 month">1 Month</SelectItem>
                  <SelectItem value="3 months">3 Months</SelectItem>
                  <SelectItem value="6 months">6 Months</SelectItem>
                  <SelectItem value="12 months">12 Months</SelectItem>
                  <SelectItem value="24 months">24 Months</SelectItem>
                  <SelectItem value="1 year">1 Year</SelectItem>
                  <SelectItem value="2 years">2 Years</SelectItem>
                  <SelectItem value="3 years">3 Years</SelectItem>
                </SelectContent>
              </Select>
              {errors.rentDuration && (
                <p className="text-red-500 text-sm mt-1">Please select rent duration</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Additional notes about the tenant"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/tenants')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding Tenant...' : 'Add Tenant'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}