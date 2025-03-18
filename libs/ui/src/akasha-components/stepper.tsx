import * as React from 'react';
import { Check, Dot } from 'lucide-react';

import { cn } from '@/library/utils';

const Stepper = React.forwardRef<
  React.ElementRef<'nav'>,
  React.ComponentProps<'nav'> & {
    currentStep: number;
    numberOfSteps: number;
  }
>(({ currentStep, numberOfSteps, className, ...props }, ref) => {
  return (
    <nav
      ref={ref}
      data-slot="stepper"
      className={cn('w-full', className)}
      {...props}
      aria-label="Progress"
    >
      <ol className="flex items-center justify-between">
        {[...Array(numberOfSteps)].map((_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isLast = index === numberOfSteps - 1;

          const completedStyle = isCompleted
            ? 'border-primary bg-primary'
            : 'border-muted bg-transparent';

          return (
            <li
              key={stepNumber}
              className={cn('relative', !isLast && 'flex-1')}
              aria-current={isActive ? 'step' : undefined}
            >
              {!isLast && (
                <div
                  className={cn(
                    'absolute left-8 top-1/2 h-0.5 w-[calc(100%-32px)] -translate-y-1/2 transition-colors duration-300',
                    isCompleted ? 'bg-primary' : 'bg-muted',
                  )}
                  aria-hidden="true"
                />
              )}
              <div
                className={cn(
                  'relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300',
                  isActive ? 'border-primary bg-transparent' : completedStyle,
                )}
                aria-label={`Step ${stepNumber}`}
              >
                {isCompleted ? (
                  <Check
                    size={20}
                    className="text-primary-foreground transition-colors duration-300"
                  />
                ) : (
                  <Dot
                    size={20}
                    strokeWidth={8}
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
});

export { Stepper };
