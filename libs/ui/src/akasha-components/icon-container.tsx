import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/library/utils';

const iconContainerStyles = cva('flex items-center justify-center relative bg-muted', {
  variants: {
    variant: {
      square: 'rounded-[0.5rem]',
      round: 'rounded-full',
    },
    size: {
      xl: 'size-28 [&_svg]:size-10',
      lg: 'size-12 [&_svg]:size-6',
      md: 'size-10 [&_svg]:size-5',
      sm: 'size-8 [&_svg]:size-4',
      xs: 'size-4 [&_svg]:size-4',
    },
  },
  compoundVariants: [
    {
      variant: 'square',
      size: 'xs',
      class: 'rounded-[0.25rem]',
    },
  ],
  defaultVariants: {
    variant: 'round',
    size: 'md',
  },
});

export interface IconContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof iconContainerStyles> {
  showNotificationDot?: boolean; // If true, show the notification dot
}

const IconContainer = React.forwardRef<HTMLDivElement, IconContainerProps>(
  ({ variant, size, className, showNotificationDot = false, children, ...props }, ref) => {
    return (
      <div ref={ref} className={iconContainerStyles({ variant, size, className })} {...props}>
        {children}
        {showNotificationDot && (
          <div
            className={cn(
              'absolute rounded-full w-3 h-3 bg-orange-500 top-0 right-0',
              variant === 'square' && '-right-1',
            )}
          />
        )}
      </div>
    );
  },
);
IconContainer.displayName = 'IconContainer';

export { IconContainer };
