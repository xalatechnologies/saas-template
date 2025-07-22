import React, { useState, useEffect, useRef, ReactElement } from 'react';
import { styled } from '@/styles';
import { animation } from '@/design-tokens/base/airbnb-animation';

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
  /** Array of image objects to display */
  images: ImageItem[];
  /** Number of columns in the grid */
  columns?: 1 | 2 | 3 | 4;
  /** Gap between images in rem units */
  gap?: number;
  /** Whether to reveal images with staggered animation */
  staggered?: boolean;
  /** Whether to use a masonry layout */
  masonry?: boolean;
  /** Optional CSS class name */
  className?: string;
}

/**
 * ImageGallery component that replicates Airbnb's image gallery with hover effects
 * Features lazy loading, staggered reveals, and the signature Airbnb hover zoom
 */
export const ImageGallery = ({
  images,
  columns = 3,
  gap = 1,
  staggered = true,
  masonry = false,
  className,
}: ImageGalleryProps): ReactElement => {
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleImageLoad = (src: string) => {
    setLoadedImages((prev) => ({
      ...prev,
      [src]: true,
    }));
  };

  const getStaggerDelay = (index: number): string => {
    if (!staggered || !isVisible) return '0ms';
    
    const baseDelay = parseInt(animation.delay.short);
    const perItem = parseInt(animation.stagger.medium);
    
    // Airbnb staggers by row in grid layouts
    if (!masonry) {
      const row = Math.floor(index / columns);
      const col = index % columns;
      return `${baseDelay + row * perItem + col * (perItem / 2)}ms`;
    }
    
    // Simple staggering for masonry
    return `${baseDelay + index * perItem}ms`;
  };

  // Split images into column arrays for masonry layout
  const getColumnImages = () => {
    const columnArrays: ImageItem[][] = Array.from({ length: columns }, () => []);
    
    images.forEach((image, index) => {
      const columnIndex = index % columns;
      columnArrays[columnIndex].push(image);
    });
    
    return columnArrays;
  };

  return (
    <Container 
      ref={containerRef}
      className={className}
      $columns={columns}
      $gap={gap}
      $masonry={masonry}
    >
      {masonry ? (
        // Masonry layout (Airbnb explore page style)
        getColumnImages().map((columnImages, colIndex) => (
          <Column key={colIndex} $gap={gap}>
            {columnImages.map((image, imgIndex) => {
              const imageIndex = colIndex + imgIndex * columns;
              return (
                <ImageWrapper 
                  key={image.src}
                  $loaded={!!loadedImages[image.src]}
                  $delay={getStaggerDelay(imageIndex)}
                  $aspectRatio={image.aspectRatio}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    onLoad={() => handleImageLoad(image.src)}
                    loading="lazy"
                  />
                </ImageWrapper>
              );
            })}
          </Column>
        ))
      ) : (
        // Grid layout (Airbnb listing page style)
        images.map((image, index) => (
          <ImageWrapper 
            key={image.src}
            $loaded={!!loadedImages[image.src]}
            $delay={getStaggerDelay(index)}
            $aspectRatio={image.aspectRatio}
          >
            <Image
              src={image.src}
              alt={image.alt}
              onLoad={() => handleImageLoad(image.src)}
              loading="lazy"
            />
          </ImageWrapper>
        ))
      )}
    </Container>
  );
};

interface ContainerProps {
  $columns: number;
  $gap: number;
  $masonry: boolean;
}

const Container = styled.div<ContainerProps>`
  display: ${props => props.$masonry ? 'flex' : 'grid'};
  grid-template-columns: ${props => `repeat(${props.$columns}, 1fr)`};
  gap: ${props => `${props.$gap}rem`};
  width: 100%;
`;

interface ColumnProps {
  $gap: number;
}

const Column = styled.div<ColumnProps>`
  display: flex;
  flex-direction: column;
  gap: ${props => `${props.$gap}rem`};
  flex: 1;
`;

interface ImageWrapperProps {
  $loaded: boolean;
  $delay: string;
  $aspectRatio?: number;
}

const ImageWrapper = styled.div<ImageWrapperProps>`
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  aspect-ratio: ${props => props.$aspectRatio || 1.5};
  
  /* Airbnb's signature image reveal animation */
  opacity: ${props => (props.$loaded ? 1 : 0)};
  transform: ${props => (props.$loaded ? 'translateY(0)' : 'translateY(10px)')};
  transition: 
    opacity ${animation.durations.normal} ${animation.easings.easeOut},
    transform ${animation.durations.normal} ${animation.easings.softLanding};
  transition-delay: ${props => props.$delay};
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  
  /* Airbnb's signature image hover effect */
  transition: transform ${animation.durations.normal} ${animation.easings.softLanding};
  
  /* Create the exact Airbnb image zoom on hover */
  ${ImageWrapper}:hover & {
    transform: scale(1.03);
  }
`;

/**
 * Image with hover zoom effect, matches Airbnb's exact behavior
 */
export const ZoomableImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  overflow: hidden;
  
  /* Exact Airbnb transition timing */
  transition: transform ${animation.durations.normal} ${animation.easings.softLanding};
  
  &:hover {
    transform: scale(1.03);
  }
`;
