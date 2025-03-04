import * as React from 'react';

import { cn } from '@/library/utils';

import { typographyVariants } from './typography';

const Card = React.forwardRef<React.ElementRef<'div'>, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card"
        className={cn(
          'bg-card text-card-foreground rounded-lg border overflow-hidden p-6',
          className,
        )}
        {...props}
      />
    );
  },
);

const CardHeader = React.forwardRef<React.ElementRef<'div'>, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-header"
        className={cn('flex flex-col space-y-1.5 pb-6', className)}
        {...props}
      />
    );
  },
);

const CardTitle = React.forwardRef<React.ElementRef<'div'>, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-title"
        className={cn('text-center font-bold', typographyVariants({ variant: 'h5' }), className)}
        {...props}
      />
    );
  },
);

const CardDescription = React.forwardRef<React.ElementRef<'div'>, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-description"
        className={cn('text-muted-foreground text-sm text-center ', className)}
        {...props}
      />
    );
  },
);

const CardContent = React.forwardRef<React.ElementRef<'div'>, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-content"
        className={cn('flex justify-center', className)}
        {...props}
      />
    );
  },
);

const CardFooter = React.forwardRef<React.ElementRef<'div'>, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-footer"
        className={cn('flex items-center justify-end w-full gap-2 pt-6', className)}
        {...props}
      />
    );
  },
);

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
