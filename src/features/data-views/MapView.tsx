'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Map as MapIcon, 
  Locate, 
  ZoomIn, 
  ZoomOut, 
  Layers,
  Search,
  Filter as FilterIcon
} from 'lucide-react';
import { Button, Input, Card, FlexLayout } from '@/components';
import { cn } from '@/utils';

export interface MapMarker<T> {
  readonly id: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly data: T;
  readonly icon?: React.ComponentType<{ className?: string }>;
  readonly color?: string;
}

export interface MapViewProps<T> {
  readonly markers: MapMarker<T>[];
  readonly center?: { lat: number; lng: number };
  readonly zoom?: number;
  readonly onMarkerClick?: (marker: MapMarker<T>) => void;
  readonly onMapClick?: (lat: number, lng: number) => void;
  readonly renderPopup?: (marker: MapMarker<T>) => React.ReactNode;
  readonly showControls?: boolean;
  readonly showSearch?: boolean;
  readonly height?: string;
  readonly loading?: boolean;
  readonly className?: string;
  readonly mapProvider?: 'google' | 'mapbox' | 'leaflet';
}

/**
 * Map view component for geographic displays
 * Note: This is a placeholder implementation. 
 * You'll need to integrate with an actual map library like Google Maps, Mapbox, or Leaflet
 * @returns JSX.Element
 */
export function MapView<T>({
  markers,
  center = { lat: 0, lng: 0 },
  zoom = 10,
  onMarkerClick,
  onMapClick,
  renderPopup,
  showControls = true,
  showSearch = true,
  height = '600px',
  loading = false,
  className,
  mapProvider = 'leaflet',
}: MapViewProps<T>): JSX.Element {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker<T> | null>(null);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'terrain'>('streets');

  // This is where you would initialize your map library
  useEffect(() => {
    if (!mapRef.current) return;

    // Example: Initialize map
    // const map = new MapLibrary.Map(mapRef.current, {
    //   center: [center.lat, center.lng],
    //   zoom: mapZoom,
    // });

    // Add markers
    // markers.forEach(marker => {
    //   const mapMarker = new MapLibrary.Marker({
    //     position: [marker.latitude, marker.longitude],
    //   });
    //   mapMarker.addTo(map);
    // });

    console.log('Map initialized with', markers.length, 'markers');
  }, [markers, center, mapZoom]);

  const handleMarkerClick = (marker: MapMarker<T>) => {
    setSelectedMarker(marker);
    onMarkerClick?.(marker);
  };

  const handleZoomIn = () => {
    setMapZoom(prev => Math.min(prev + 1, 20));
  };

  const handleZoomOut = () => {
    setMapZoom(prev => Math.max(prev - 1, 1));
  };

  const handleLocateMe = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Current position:', position.coords);
          // Center map on user location
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  if (loading) {
    return (
      <div 
        className={cn('bg-muted rounded-xl', className)}
        style={{ height }}
      >
        <FlexLayout direction="row" align="center" justify="center" className="h-full">
          <div className="text-center">
            <MapIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </FlexLayout>
      </div>
    );
  }

  return (
    <div className={cn('relative rounded-xl overflow-hidden', className)} style={{ height }}>
      {/* Map Container */}
      <div 
        ref={mapRef}
        className="absolute inset-0 bg-muted"
        onClick={(e) => {
          // Get click coordinates and convert to lat/lng
          // This is a placeholder - actual implementation depends on map library
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          console.log('Map clicked at:', x, y);
          // onMapClick?.(lat, lng);
        }}
      >
        {/* Placeholder map visualization */}
        <div className="absolute inset-0">
          <FlexLayout direction="row" align="center" justify="center" className="h-full">
          <div className="text-center">
            <MapIcon className="h-24 w-24 text-muted-foreground/30" />
            <p className="text-muted-foreground mt-4">
              Map Provider: {mapProvider}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {markers.length} markers loaded
            </p>
          </div>
          </FlexLayout>
        </div>

        {/* Render markers as overlays (placeholder) */}
        {markers.map((marker) => {
          const Icon = marker.icon || MapIcon;
          // Calculate position (this is a placeholder)
          const left = `${50 + (marker.longitude / 180) * 30}%`;
          const top = `${50 - (marker.latitude / 90) * 30}%`;

          return (
            <div
              key={marker.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left, top }}
              onClick={(e) => {
                e.stopPropagation();
                handleMarkerClick(marker);
              }}
            >
              <div className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center shadow-lg',
                marker.color ? `bg-${marker.color}-500` : 'bg-primary'
              )}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="absolute top-4 left-4 right-4 md:right-auto md:w-80 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search location..."
              className="pl-10 pr-10 bg-background/95 backdrop-blur-sm rounded-xl shadow-lg"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg"
            >
              <FilterIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Map Controls */}
      {showControls && (
        <div className="absolute bottom-4 right-4 z-10">
          <FlexLayout direction="column" gap="sm">
          <Button
            variant="secondary"
            size="icon"
            onClick={handleZoomIn}
            className="rounded-xl shadow-lg bg-background/95 backdrop-blur-sm"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleZoomOut}
            className="rounded-xl shadow-lg bg-background/95 backdrop-blur-sm"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleLocateMe}
            className="rounded-xl shadow-lg bg-background/95 backdrop-blur-sm"
            aria-label="Find my location"
          >
            <Locate className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => {
              const styles: Array<'streets' | 'satellite' | 'terrain'> = ['streets', 'satellite', 'terrain'];
              const currentIndex = styles.indexOf(mapStyle);
              const nextIndex = (currentIndex + 1) % styles.length;
              setMapStyle(styles[nextIndex]);
            }}
            className="rounded-xl shadow-lg bg-background/95 backdrop-blur-sm"
            aria-label="Change map style"
          >
            <Layers className="h-4 w-4" />
          </Button>
          </FlexLayout>
        </div>
      )}

      {/* Marker Popup */}
      {selectedMarker && renderPopup && (
        <div className="absolute bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 z-20">
          <Card className="p-8 shadow-xl">
            <button
              onClick={() => setSelectedMarker(null)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
            {renderPopup(selectedMarker)}
          </Card>
        </div>
      )}

      {/* Map Attribution */}
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
        © Map Provider
      </div>
    </div>
  );
}

/**
 * Map cluster component for grouped markers
 */
interface MapClusterProps {
  readonly count: number;
  readonly onClick: () => void;
}

export const MapCluster = ({ count, onClick }: MapClusterProps): JSX.Element => {
  return (
    <button
      onClick={onClick}
      className="h-12 w-12 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
    >
      {count}
    </button>
  );
};