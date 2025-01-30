import React, { forwardRef } from 'react';
import { Check, Dot } from 'lucide-react';

import { cn } from '@/library/utils';

interface StepperProps extends React.HTMLAttributes<HTMLElement> {
  currentStep: number;
  numberOfSteps: number;
}

export const Stepper = forwardRef<HTMLElement, StepperProps>(
  ({ currentStep, numberOfSteps, className, ...props }, ref) => {
    return (
      <nav ref={ref} className={cn('w-full', className)} {...props} aria-label="Progress">
        <ol className="flex items-center justify-between">
          {[...Array(numberOfSteps)].map((_, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;
            const isLast = index === numberOfSteps - 1;

            const completedStyle = isCompleted
              ? 'border-primary bg-primary'
              : 'border-muted bg-background';

            return (
              <li
                key={stepNumber}
                className={cn('relative', !isLast && 'flex-1')}
                aria-current={isActive ? 'step' : undefined}
              >
                {!isLast && (
                  <div
                    className={cn(
                      'absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 transition-colors duration-300',
                      isCompleted ? 'bg-primary' : 'bg-muted',
                    )}
                    aria-hidden="true"
                  />
                )}
                <div
                  className={cn(
                    'relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300',
                    isActive ? 'border-primary bg-background' : completedStyle,
                  )}
                  aria-label={`Step ${stepNumber}`}
                >
                  {isCompleted ? (
                    <Check className="text-primary-foreground transition-colors duration-300" />
                  ) : (
                    <Dot
                      strokeWidth={10}
                      className={cn(
                        isActive ? 'text-primary' : 'text-muted',
                        'transition-colors duration-300',
                      )}
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);
