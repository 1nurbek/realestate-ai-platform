'use client';

import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';

interface MapViewProps {
  latitude: number;
  longitude: number;
  zoom?: number;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

export default function MapView({ latitude, longitude, zoom = 14 }: MapViewProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === 'your-google-maps-api-key') {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-100 text-sm text-slate-500">
        Google Maps API key not configured
      </div>
    );
  }

  return <MapInner latitude={latitude} longitude={longitude} zoom={zoom} apiKey={apiKey} />;
}

function MapInner({
  latitude,
  longitude,
  zoom,
  apiKey,
}: MapViewProps & { apiKey: string }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  const center = { lat: latitude, lng: longitude };

  if (loadError) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-rose-200 bg-rose-50 text-sm text-rose-500">
        Failed to load Google Maps
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-400">
        Loading map...
      </div>
    );
  }

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={zoom}>
      <Marker position={center} />
    </GoogleMap>
  );
}
