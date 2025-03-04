import * as React from 'react';

import { cn } from '@/library/utils';

const StackedAvatar = React.forwardRef<
  React.ElementRef<'div'>,
  Omit<React.ComponentProps<'div'>, 'children'> & {
    count: number;
    children: (index: number) => React.ReactNode;
  }
>(({ className, count, children, ...props }, ref) => {
  const safeCount = Math.max(0, Math.floor(count));

  return (
    <div ref={ref} data-slot="stacked-avatar" className={cn('flex flex-row', className)} {...props}>
      {Array.from({ length: safeCount }, (_, index) => (
        <div
          key={index}
          className={cn('rounded-full border border-border')}
          style={{ transform: `translateX(-${index * 50}%)` }}
        >
          {children(index)}
        </div>
      ))}
    </div>
  );
});

export { StackedAvatar };
