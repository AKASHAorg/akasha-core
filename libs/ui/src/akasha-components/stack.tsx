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
  },
  defaultVariants: {
    direction: 'column',
  },
});

const Stack = ({
  className,
  justifyContent,
  alignItems,
  direction = 'column',
  divider,
  spacing,
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof stackVariants> & {
    spacing?: number;
    divider?: boolean;
  }) => {
  return (
    <div
      data-slot="stack"
      className={cn(
        stackVariants({
          justifyContent,
          alignItems,
          direction,
          className,
        }),
        spacing && `gap-${spacing}`,
        divider && {
          'divide-y': direction === 'column' || direction === 'columnReverse',
          'divide-x': direction === 'row' || direction === 'rowReverse',
        },
      )}
      {...props}
    />
  );
};

export { Stack, stackVariants };
