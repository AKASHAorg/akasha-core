import * as React from 'react';

import { cn } from '@/library/utils';

const Skeleton = React.forwardRef<React.ElementRef<'div'>, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('animate-pulse rounded-[0.375rem] bg-muted', className)}
      {...props}
    />
  ),
);

export { Skeleton };
