"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, MapPin, Plus, Eye } from 'lucide-react';
import GoogleMap from '@/components/GoogleMap';

interface Property {
  _id: string;
  title: string;
  description: string;
  address: string;
  coordinates: { lat: number; lng: number };
  landDocuments: string[];
  propertyImages: string[];
  popularPlaces: Array<{ name: string; type: string; distance: string }>;
  totalRenovationCost: number;
  purchasePrice: number;
  estimatedValue: number;
  createdAt: string;
}

export default function Properties() {
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600">Manage your property portfolio</p>
        </div>
        <Link href="/dashboard/properties/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </Link>
      </div>

      {/* Map View */}
      {properties.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Property Locations</CardTitle>
            <CardDescription>View all your properties on the map</CardDescription>
          </CardHeader>
          <CardContent>
            <GoogleMap properties={mapProperties} height="400px" />
          </CardContent>
        </Card>
      )}

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property._id} className="overflow-hidden">
            <div className="aspect-video bg-gray-200">
              {property.propertyImages.length > 0 ? (
                <img
                  src={property.propertyImages[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Building className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            
            <CardHeader>
              <CardTitle className="text-lg">{property.title}</CardTitle>
              <CardDescription className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                {property.address}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {property.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {property.description}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {property.popularPlaces.slice(0, 2).map((place, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {place.name} ({place.distance})
                    </Badge>
                  ))}
                  {property.popularPlaces.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{property.popularPlaces.length - 2} more
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {property.purchasePrice && (
                    <div>
                      <p className="text-gray-500">Purchase Price</p>
                      <p className="font-medium">₦{property.purchasePrice.toLocaleString()}</p>
                    </div>
                  )}
                  {property.estimatedValue && (
                    <div>
                      <p className="text-gray-500">Current Value</p>
                      <p className="font-medium">₦{property.estimatedValue.toLocaleString()}</p>
                    </div>
                  )}
                </div>
                
                {property.totalRenovationCost > 0 && (
                  <div className="text-sm">
                    <p className="text-gray-500">Total Renovations</p>
                    <p className="font-medium text-blue-600">₦{property.totalRenovationCost.toLocaleString()}</p>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-3">
                  <span className="text-xs text-gray-500">
                    Added {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {properties.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first property</p>
            <Link href="/dashboard/properties/new">
              <Button>Add Your First Property</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}