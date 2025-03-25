import * as React from 'react';

import { cn } from '@/library/utils';

import { typographyVariants } from './typography';

const Card = React.forwardRef<React.ElementRef<'div'>, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card"
      className={cn('bg-card text-card-foreground flex flex-col rounded-lg border p-6', className)}
      {...props}
    />
  ),
);

const CardHeader = React.forwardRef<React.ElementRef<'div'>, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 pb-6 has-[data-slot=card-action]:grid-cols-[1fr_auto]',
        className,
      )}
      {...props}
    />
  ),
);

const CardTitle = React.forwardRef<React.ElementRef<'div'>, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-title"
      className={cn('font-bold text-center', typographyVariants({ variant: 'h5' }), className)}
      {...props}
    />
  ),
);

const CardDescription = React.forwardRef<React.ElementRef<'div'>, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm text-center', className)}
      {...props}
    />
  ),
);

const CardAction = React.forwardRef<React.ElementRef<'div'>, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  ),
);

const CardContent = React.forwardRef<React.ElementRef<'div'>, React.ComponentProps<'div'>>(
  (props, ref) => <div ref={ref} data-slot="card-content" {...props} />,
);

const CardFooter = React.forwardRef<React.ElementRef<'div'>, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn('flex items-center justify-end gap-2', className)}
      {...props}
    />
  ),
);

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
