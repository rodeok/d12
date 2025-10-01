"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { UploadButton } from '@/lib/uploadthing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import GoogleMap from './GoogleMap';
import { toast } from 'react-hot-toast';

interface PropertyFormData {
  title: string;
  description: string;
  address: string;
  coordinates: { lat: number; lng: number };
  purchasePrice: number;
  estimatedValue: number;
  popularPlaces: Array<{ name: string; type: string; distance: string }>;
}

export default function PropertyForm() {
  const router = useRouter();
  const [landDocuments, setLandDocuments] = useState<string[]>([]);
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [popularPlaces, setPopularPlaces] = useState([
    { name: '', type: '', distance: '' }
  ]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<PropertyFormData>();

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setSelectedLocation(location);
    setValue('coordinates', { lat: location.lat, lng: location.lng });
    setValue('address', location.address);
  };

  const addPopularPlace = () => {
    setPopularPlaces([...popularPlaces, { name: '', type: '', distance: '' }]);
  };

  const updatePopularPlace = (index: number, field: string, value: string) => {
    const updated = popularPlaces.map((place, i) => 
      i === index ? { ...place, [field]: value } : place
    );
    setPopularPlaces(updated);
  };

  const removePopularPlace = (index: number) => {
    setPopularPlaces(popularPlaces.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PropertyFormData) => {
    if (!selectedLocation) {
      toast.error('Please select a location on the map');
      return;
    }

    setLoading(true);

    try {
      const propertyData = {
        ...data,
        coordinates: selectedLocation,
        landDocuments,
        propertyImages,
        popularPlaces: popularPlaces.filter(place => place.name && place.type),
      };

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData),
      });

      if (response.ok) {
        toast.success('Property added successfully!');
        router.push('/dashboard/properties');
      } else {
        toast.error('Failed to add property');
      }
    } catch (error) {
      toast.error('An error occurred while adding the property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Property</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title">Property Title*</Label>
              <Input
                id="title"
                {...register('title', { required: 'Property title is required' })}
                placeholder="Enter property title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="address">Address*</Label>
              <Input
                id="address"
                {...register('address', { required: 'Address is required' })}
                value={selectedLocation?.address || ''}
                placeholder="Click on map to select location"
                readOnly
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter property description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="purchasePrice">Purchase Price</Label>
              <Input
                id="purchasePrice"
                type="number"
                {...register('purchasePrice', { valueAsNumber: true })}
                placeholder="Enter purchase price"
              />
            </div>

            <div>
              <Label htmlFor="estimatedValue">Estimated Current Value</Label>
              <Input
                id="estimatedValue"
                type="number"
                {...register('estimatedValue', { valueAsNumber: true })}
                placeholder="Enter estimated value"
              />
            </div>
          </div>

          <div>
            <Label>Select Location on Map*</Label>
            <p className="text-sm text-gray-600 mb-2">Click on the map to pin your property location</p>
            <GoogleMap onLocationSelect={handleLocationSelect} height="300px" />
          </div>

          <div>
            <Label>Popular Places Nearby</Label>
            {popularPlaces.map((place, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <Input
                  placeholder="Place name (e.g., Shell Filling Station)"
                  value={place.name}
                  onChange={(e) => updatePopularPlace(index, 'name', e.target.value)}
                />
                <Input
                  placeholder="Type (e.g., filling station)"
                  value={place.type}
                  onChange={(e) => updatePopularPlace(index, 'type', e.target.value)}
                />
                <Input
                  placeholder="Distance (e.g., 500m)"
                  value={place.distance}
                  onChange={(e) => updatePopularPlace(index, 'distance', e.target.value)}
                />
                {popularPlaces.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removePopularPlace(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addPopularPlace} className="mt-2">
              Add Popular Place
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Land Documents</Label>
              <UploadButton
                endpoint="documentUploader"
                onClientUploadComplete={(res) => {
                  if (res) {
                    setLandDocuments(prev => [...prev, ...res.map(file => file.url)]);
                    toast.success('Documents uploaded successfully!');
                  }
                }}
                onUploadError={(error) => {
                  toast.error(`Upload failed: ${error.message}`);
                }}
              />
              {landDocuments.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Uploaded Documents:</p>
                  <ul className="text-sm text-gray-600">
                    {landDocuments.map((doc, index) => (
                      <li key={index}>Document {index + 1}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <Label>Property Images</Label>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res) {
                    setPropertyImages(prev => [...prev, ...res.map(file => file.url)]);
                    toast.success('Images uploaded successfully!');
                  }
                }}
                onUploadError={(error) => {
                  toast.error(`Upload failed: ${error.message}`);
                }}
              />
              {propertyImages.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Uploaded Images:</p>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {propertyImages.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Property ${index + 1}`}
                        className="w-full h-16 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/properties')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding Property...' : 'Add Property'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}