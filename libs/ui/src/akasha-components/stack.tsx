import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/library/utils';

const stackVariants = cva('flex divide-accent', {
  variants: {
    justifyContent: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      evenly: 'justify-evenly',
      around: 'justify-around',
      stretch: 'justify-stretch',
    },
    alignItems: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      baseline: 'items-baseline',
      stretch: 'items-stretch',
    },
    direction: {
      row: 'flex-row',
      rowReverse: 'flex-row-reverse',
      column: 'flex-col',
      columnReverse: 'flex-col-reverse',
    },
    divider: {
      row: 'divide-x',
      column: 'divide-y',
    },
  },
  defaultVariants: {
    direction: 'column',
  },
});

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {
  spacing?: 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 5 | 6 | 7 | 8;
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, justifyContent, alignItems, direction, divider, spacing, ...props }, ref) => {
    return (
      <div
        className={cn(
          stackVariants({
            justifyContent,
            alignItems,
            direction,
            divider,
            className,
          }),
          spacing && `gap-${spacing}`,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Stack.displayName = 'Stack';

export { Stack, stackVariants };
