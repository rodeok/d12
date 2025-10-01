"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface GoogleMapProps {
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  properties?: Array<{
    id: string;
    title: string;
    coordinates: { lat: number; lng: number };
    address: string;
  }>;
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
}

export default function GoogleMap({
  onLocationSelect,
  properties = [],
  center = { lat: 6.5244, lng: 3.3792 },
  zoom = 10,
  height = "400px",
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initializeMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        version: "weekly",
        libraries: ["places"],
      });

      // Cast to any because TS types don’t know importLibrary yet
      const { Map } = (await (loader as any).importLibrary("maps")) as google.maps.MapsLibrary;
      const { Marker } = (await (loader as any).importLibrary("marker")) as google.maps.MarkerLibrary;

      if (mapRef.current) {
        const map = new Map(mapRef.current, {
          center,
          zoom,
        });

        setIsLoaded(true);

        // Location selection
        if (onLocationSelect) {
          map.addListener("click", async (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
              const lat = event.latLng.lat();
              const lng = event.latLng.lng();

              const geocoder = new google.maps.Geocoder();
              try {
                const result = await geocoder.geocode({ location: { lat, lng } });
                const address =
                  result.results[0]?.formatted_address || `${lat}, ${lng}`;
                onLocationSelect({ lat, lng, address });
              } catch {
                onLocationSelect({ lat, lng, address: `${lat}, ${lng}` });
              }
            }
          });
        }

        // Add property markers
        properties.forEach((property) => {
          const marker = new Marker({
            position: property.coordinates,
            map,
            title: property.title,
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-bold text-sm">${property.title}</h3>
                <p class="text-xs text-gray-600">${property.address}</p>
              </div>
            `,
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });
        });
      }
    };

    initializeMap();
  }, [center, zoom, onLocationSelect, properties]);

  return (
    <div className="w-full">
      <div
        ref={mapRef}
        style={{ width: "100%", height }}
        className="rounded-lg"
      />
      {!isLoaded && (
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
