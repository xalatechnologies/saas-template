'use client';

import React, { useState, createContext, useContext } from 'react';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button, Progress } from '../ui';
import { cn } from '@/utils';

interface Step {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly icon?: React.ComponentType<{ className?: string }>;
}

interface StepWizardProps {
  readonly children: React.ReactNode;
  readonly steps: Step[];
  readonly onComplete?: (data: any) => void;
  readonly className?: string;
  readonly showProgressBar?: boolean;
  readonly allowSkip?: boolean;
  readonly allowNavigation?: boolean;
}

interface StepContentProps {
  readonly children: React.ReactNode;
  readonly stepId: string;
}

interface WizardActionsProps {
  readonly children?: React.ReactNode;
  readonly nextLabel?: string;
  readonly prevLabel?: string;
  readonly completeLabel?: string;
  readonly onNext?: () => boolean | Promise<boolean>;
  readonly onPrev?: () => void;
  readonly className?: string;
}

interface StepWizardContextType {
  currentStep: number;
  steps: Step[];
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  completedSteps: Set<number>;
  markStepComplete: (step: number) => void;
}

const StepWizardContext = createContext<StepWizardContextType | null>(null);

const useStepWizard = () => {
  const context = useContext(StepWizardContext);
  if (!context) {
    throw new Error('useStepWizard must be used within StepWizard');
  }
  return context;
};

/**
 * Step wizard component for multi-step forms and processes
 * @returns JSX.Element
 */
export const StepWizard = ({
  children,
  steps,
  onComplete,
  className,
  showProgressBar = true,
  allowSkip = false,
  allowNavigation = true,
}: StepWizardProps): JSX.Element => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      if (allowNavigation || step === currentStep + 1 || step === currentStep - 1) {
        setCurrentStep(step);
      }
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      markStepComplete(currentStep);
      setCurrentStep(currentStep + 1);
    } else if (onComplete) {
      markStepComplete(currentStep);
      onComplete({});
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const markStepComplete = (step: number) => {
    setCompletedSteps(new Set([...completedSteps, step]));
  };

  const contextValue: StepWizardContextType = {
    currentStep,
    steps,
    goToStep,
    nextStep,
    prevStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
    completedSteps,
    markStepComplete,
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <StepWizardContext.Provider value={contextValue}>
      <div className={cn('w-full space-y-8', className)}>
        {/* Progress Bar */}
        {showProgressBar && (
          <div className="space-y-4">
            <Progress value={progress} className="h-4" />
            <p className="text-base text-muted-foreground text-center">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        )}

        {/* Step Indicators */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = completedSteps.has(index);
            const isClickable = allowNavigation || (allowSkip && index > currentStep);

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => isClickable && goToStep(index)}
                  disabled={!isClickable}
                  className={cn(
                    'flex flex-col items-center space-y-4 p-6 rounded-xl transition-all duration-200',
                    isClickable && 'cursor-pointer hover:bg-accent',
                    !isClickable && 'cursor-not-allowed opacity-50',
                    isActive && 'bg-primary/10'
                  )}
                >
                  <div
                    className={cn(
                      'h-16 w-16 rounded-full flex items-center justify-center text-base font-semibold transition-all duration-200 shadow-lg',
                      isCompleted && 'bg-primary text-primary-foreground',
                      isActive && !isCompleted && 'bg-primary/20 text-primary border-2 border-primary',
                      !isActive && !isCompleted && 'bg-muted text-muted-foreground'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-6 w-6" />
                    ) : Icon ? (
                      <Icon className="h-6 w-6" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="text-center">
                    <p
                      className={cn(
                        'text-base font-semibold',
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="text-base text-muted-foreground mt-2 max-w-[200px]">
                        {step.description}
                      </p>
                    )}
                  </div>
                </button>
                {index < steps.length - 1 && (
                  <ChevronRight className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="min-h-[600px]">{children}</div>
      </div>
    </StepWizardContext.Provider>
  );
};

/**
 * Step content wrapper component
 * @returns JSX.Element | null
 */
export const StepContent = ({ children, stepId }: StepContentProps): JSX.Element | null => {
  const { steps, currentStep } = useStepWizard();
  const stepIndex = steps.findIndex(step => step.id === stepId);

  if (stepIndex !== currentStep) {
    return null;
  }

  return <div className="animate-in fade-in-0 slide-in-from-right-4">{children}</div>;
};

/**
 * Wizard action buttons component
 * @returns JSX.Element
 */
export const WizardActions = ({
  children,
  nextLabel = 'Next',
  prevLabel = 'Previous',
  completeLabel = 'Complete',
  onNext,
  onPrev,
  className,
}: WizardActionsProps): JSX.Element => {
  const { nextStep, prevStep, isFirstStep, isLastStep } = useStepWizard();

  const handleNext = async () => {
    if (onNext) {
      const canProceed = await onNext();
      if (canProceed) {
        nextStep();
      }
    } else {
      nextStep();
    }
  };

  const handlePrev = () => {
    if (onPrev) {
      onPrev();
    }
    prevStep();
  };

  return (
    <div className={cn('flex items-center justify-between pt-12', className)}>
      <Button
        variant="outline"
        onClick={handlePrev}
        disabled={isFirstStep}
        className="rounded-xl"
      >
        <ChevronLeft className="h-5 w-5 mr-4" />
        {prevLabel}
      </Button>

      {children}

      <Button
        onClick={handleNext}
        className="rounded-xl shadow-lg"
      >
        {isLastStep ? completeLabel : nextLabel}
        {!isLastStep && <ChevronRight className="h-5 w-5 ml-4" />}
      </Button>
    </div>
  );
};

export { useStepWizard };