'use client';

import React, { useState } from 'react';
import { cn } from '@/utils';

/**
 * Image object structure
 */
interface ImageItem {
  /** Image URL */
  src: string;
  /** Image alt text */
  alt: string;
  /** Optional aspect ratio */
  aspectRatio?: number;
}

/**
 * Props for ImageGallery component
 */
interface ImageGalleryProps {
  /** Array of images to display */
  images: ImageItem[];
  /** Number of columns in grid */
  columns?: number;
  /** Gap between images */
  gap?: 'sm' | 'md' | 'lg';
  /** Aspect ratio for images */
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  /** Enable image hover effects */
  enableHover?: boolean;
  /** Enable lazy loading */
  lazyLoad?: boolean;
  /** Callback when image is clicked */
  onImageClick?: (image: ImageItem, index: number) => void;
  /** Custom image rendering */
  renderImage?: (image: ImageItem, index: number) => React.ReactNode;
  /** Loading placeholder */
  loadingPlaceholder?: React.ReactNode;
  /** Error placeholder */
  errorPlaceholder?: React.ReactNode;
  /** Custom className */
  className?: string;
}

/**
 * Image Gallery component with animations
 * @returns JSX.Element
 */
export const ImageGallery = ({
  images,
  columns = 3,
  gap = 'md',
  aspectRatio = 'auto',
  enableHover = true,
  lazyLoad = true,
  onImageClick,
  renderImage,
  loadingPlaceholder,
  errorPlaceholder,
  className,
}: ImageGalleryProps): JSX.Element => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<number>>(new Set());

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  };

  const handleImageError = (index: number) => {
    setErrorImages(prev => new Set(prev).add(index));
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4', 
    lg: 'gap-6'
  };

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    auto: ''
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6'
  };

  return (
    <div className={cn(
      'grid w-full',
      gridCols[Math.min(columns, 6) as keyof typeof gridCols] || gridCols[3],
      gapClasses[gap],
      className
    )}>
      {images.map((image, index) => (
        <div
          key={`${image.src}-${index}`}
          className={cn(
            'relative overflow-hidden rounded-xl bg-muted',
            aspectRatioClasses[aspectRatio],
            'animate-in fade-in duration-300',
            enableHover && 'transition-transform duration-200 ease-out hover:scale-105 hover:-translate-y-1',
            onImageClick && 'cursor-pointer'
          )}
          style={{ 
            animationDelay: `${index * 50}ms`,
            animationFillMode: 'both'
          }}
          onClick={() => onImageClick?.(image, index)}
        >
          {renderImage ? (
            renderImage(image, index)
          ) : (
            <>
              {!errorImages.has(index) && (
                <img
                  src={image.src}
                  alt={image.alt}
                  loading={lazyLoad ? 'lazy' : 'eager'}
                  className={cn(
                    'w-full h-full object-cover transition-opacity duration-300',
                    loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                  )}
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                />
              )}
              
              {!loadedImages.has(index) && !errorImages.has(index) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {loadingPlaceholder || (
                    <div className="animate-pulse bg-muted-foreground/20 rounded-lg w-8 h-8" />
                  )}
                </div>
              )}
              
              {errorImages.has(index) && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  {errorPlaceholder || (
                    <div className="text-muted-foreground text-sm">
                      Failed to load
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;