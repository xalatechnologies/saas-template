import React, { useState } from 'react';
import { cn } from '@/utils';
import { Button } from '../button';
import { GridLayout } from '../../layout/GridLayout';

/**
 * AnimationExample component demonstrating various animations
 * @returns JSX.Element
 */
export const AnimationExample = (): JSX.Element => {
  const [showFade, setShowFade] = useState(false);
  const [showSlide, setShowSlide] = useState(false);
  const [showScale, setShowScale] = useState(false);
  const [showStagger, setShowStagger] = useState(false);

  const examples = [
    { title: 'Item 1', color: 'bg-destructive' },
    { title: 'Item 2', color: 'bg-primary' },
    { title: 'Item 3', color: 'bg-success' },
    { title: 'Item 4', color: 'bg-secondary' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          Animation Examples
        </h1>
        <p className="text-muted-foreground">
          Demonstrating Tailwind CSS animations with design tokens
        </p>
      </div>

      {/* Fade Animation */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Fade Animation</h2>
          <Button onClick={() => setShowFade(!showFade)}>
            {showFade ? 'Hide' : 'Show'} Fade
          </Button>
        </div>
        {showFade && (
          <div className="animate-in fade-in duration-300">
            <div className="p-6 bg-card rounded-xl shadow-lg">
              <p>This content fades in smoothly!</p>
            </div>
          </div>
        )}
      </div>

      {/* Slide Animation */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Slide Animation</h2>
          <Button onClick={() => setShowSlide(!showSlide)}>
            {showSlide ? 'Hide' : 'Show'} Slide
          </Button>
        </div>
        {showSlide && (
          <div className="animate-in slide-in-from-bottom-4 duration-400">
            <div className="p-6 bg-card rounded-xl shadow-lg">
              <p>This content slides up from the bottom!</p>
            </div>
          </div>
        )}
      </div>

      {/* Scale Animation */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Scale Animation</h2>
          <Button onClick={() => setShowScale(!showScale)}>
            {showScale ? 'Hide' : 'Show'} Scale
          </Button>
        </div>
        {showScale && (
          <div className="animate-in zoom-in-95 duration-500">
            <div className="p-6 bg-card rounded-xl shadow-lg">
              <p>This content scales in from 95%!</p>
            </div>
          </div>
        )}
      </div>

      {/* Staggered Animation */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Staggered Animation</h2>
          <Button onClick={() => setShowStagger(!showStagger)}>
            {showStagger ? 'Hide' : 'Show'} Stagger
          </Button>
        </div>
        {showStagger && (
          <GridLayout columns={{ mobile: 1, tablet: 2 }} gap="lg">
            {examples.map((example, index) => (
              <div
                key={example.title}
                className={cn(
                  'animate-in fade-in slide-in-from-bottom-4 duration-300',
                  'p-4 rounded-xl text-white font-medium',
                  example.color
                )}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                {example.title}
              </div>
            ))}
          </GridLayout>
        )}
      </div>

      {/* Hover Effects */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Hover Effects</h2>
        <GridLayout columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
          <div className="p-6 bg-card rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer">
            <p className="font-medium">Lift on Hover</p>
          </div>
          <div className="p-6 bg-card rounded-xl shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
            <p className="font-medium">Scale on Hover</p>
          </div>
          <div className="p-6 bg-card rounded-xl shadow-lg transition-all duration-200 hover:shadow-2xl hover:ring-2 hover:ring-primary/20 cursor-pointer">
            <p className="font-medium">Glow on Hover</p>
          </div>
        </GridLayout>
      </div>

      {/* Loading States */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Loading States</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p>Loading spinner</p>
          </div>
          <div className="space-y-2">
            <div className="animate-pulse bg-muted rounded-lg h-4 w-3/4"></div>
            <div className="animate-pulse bg-muted rounded-lg h-4 w-1/2"></div>
            <div className="animate-pulse bg-muted rounded-lg h-4 w-5/6"></div>
            <p className="text-sm text-muted-foreground">Skeleton loading</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationExample;