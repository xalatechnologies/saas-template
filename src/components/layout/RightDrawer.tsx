'use client';

import React from 'react';
import { X, MessageSquare } from 'lucide-react';
import { Button } from '../ui';
import { cn } from '@/utils';

interface RightDrawerProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly children?: React.ReactNode;
  readonly title?: string;
}

/**
 * Right drawer component for chatbot and other functionality
 * @returns JSX.Element
 */
export const RightDrawer = ({ 
  isOpen, 
  onClose, 
  children,
  title = 'Assistant'
}: RightDrawerProps): JSX.Element => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full sm:w-96 bg-background border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="complementary"
        aria-label={title}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close drawer"
            className="rounded-xl"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children || (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Chat assistant will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};