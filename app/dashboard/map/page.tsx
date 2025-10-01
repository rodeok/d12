"use client";

import { useState, useEffect } from 'react';
import GoogleMap from '@/components/GoogleMap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Property {
  _id: string;
  title: string;
  address: string;
  coordinates: { lat: number; lng: number };
  description: string;
}

export default function MapView() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const mapProperties = properties.map(property => ({
    id: property._id,
    title: property.title,
    coordinates: property.coordinates,
    address: property.address,
  }));

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
        <h1 className="text-3xl font-bold text-gray-900">Property Map</h1>
        <p className="text-gray-600">View all your properties on the map</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Properties Location</CardTitle>
          <CardDescription>
            Click on any marker to view property details. Total properties: {properties.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GoogleMap properties={mapProperties} height="600px" />
        </CardContent>
      </Card>

      {properties.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties to display</h3>
            <p className="text-gray-600">Add properties to see them on the map</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}