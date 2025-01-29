import * as React from 'react';

import { cn } from '@/library/utils';

export interface StackedAvatar extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  count: number;
  children: (index: number) => React.ReactNode;
}

const StackedAvatar = React.forwardRef<HTMLDivElement, StackedAvatar>(
  ({ className, count, children, ...props }, ref) => {
    return (
      <div className={cn('flex flex-row', className)} ref={ref} {...props}>
        {Array(Math.abs(count))
          .fill(0)
          .map((_, index) => (
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
  },
);
StackedAvatar.displayName = 'StackedAvatar';

export { StackedAvatar };
