'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui';
import { cn } from '@/utils';

interface ModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly children: React.ReactNode;
  readonly title?: string;
  readonly description?: string;
  readonly size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  readonly showCloseButton?: boolean;
  readonly closeOnBackdropClick?: boolean;
  readonly closeOnEscape?: boolean;
  readonly className?: string;
}

interface ModalHeaderProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

interface ModalBodyProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

interface ModalFooterProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

/**
 * Modal component with proper focus management and accessibility
 * @returns JSX.Element | null
 */
export const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className,
}: ModalProps): JSX.Element | null => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
    } else {
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw] h-[90vh]',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0"
        onClick={closeOnBackdropClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          'relative bg-background rounded-xl shadow-2xl w-full animate-in zoom-in-95 slide-in-from-bottom-4',
          sizeClasses[size],
          size === 'full' && 'flex flex-col',
          className
        )}
      >
        {/* Default Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-6 border-b border-border">
            <div>
              {title && (
                <h2 id="modal-title" className="text-xl font-semibold text-foreground">
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-description" className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-xl -mt-2 -mr-2"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={cn(size === 'full' && 'flex-1 overflow-auto')}>
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * Modal header component
 * @returns JSX.Element
 */
export const ModalHeader = ({ children, className }: ModalHeaderProps): JSX.Element => {
  return (
    <div className={cn('px-6 py-4 border-b border-border', className)}>
      {children}
    </div>
  );
};

/**
 * Modal body component
 * @returns JSX.Element
 */
export const ModalBody = ({ children, className }: ModalBodyProps): JSX.Element => {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  );
};

/**
 * Modal footer component
 * @returns JSX.Element
 */
export const ModalFooter = ({ children, className }: ModalFooterProps): JSX.Element => {
  return (
    <div className={cn('px-6 py-4 border-t border-border flex items-center justify-end space-x-4', className)}>
      {children}
    </div>
  );
};

/**
 * Confirmation modal component
 */
interface ConfirmModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void | Promise<void>;
  readonly title: string;
  readonly message: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly variant?: 'danger' | 'warning' | 'info';
  readonly isLoading?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmModalProps): JSX.Element => {
  const variantStyles = {
    danger: 'bg-destructive hover:bg-destructive/90',
    warning: 'bg-warning hover:bg-warning/90',
    info: 'bg-primary hover:bg-primary/90',
  };

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalHeader>
        <h3 className="text-lg font-semibold">{title}</h3>
      </ModalHeader>
      <ModalBody>
        <p className="text-muted-foreground">{message}</p>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
          className="rounded-xl"
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isLoading}
          className={cn('rounded-xl shadow-lg', variantStyles[variant])}
        >
          {confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
};