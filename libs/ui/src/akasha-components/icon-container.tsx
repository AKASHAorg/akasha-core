import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/library/utils';

const iconContainerStyles = cva('flex items-center justify-center relative bg-muted', {
  variants: {
    variant: {
      square: '',
      round: '',
    },
    size: {
      lg: '',
      md: '',
      sm: '',
      xs: '',
    },
  },
  compoundVariants: [
    {
      variant: 'square',
      size: 'lg',
      class: 'size-28 [&_svg]:size-10 rounded-3xl',
    },
    {
      variant: 'square',
      size: 'md',
      class: 'size-14 [&_svg]:size-6 rounded-2xl',
    },
    {
      variant: 'square',
      size: 'sm',
      class: 'size-10 [&_svg]:size-5 rounded-xl',
    },
    {
      variant: 'round',
      size: 'lg',
      class: 'size-12 [&_svg]:size-6 rounded-full',
    },
    {
      variant: 'round',
      size: 'md',
      class: 'size-10 [&_svg]:size-5 rounded-full',
    },
    {
      variant: 'round',
      size: 'sm',
      class: 'size-8 [&_svg]:size-4 rounded-full',
    },
    {
      variant: 'round',
      size: 'xs',
      class: 'size-5 [&_svg]:size-3 rounded-full',
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
          <div className={cn('absolute rounded-full w-3 h-3 bg-orange-500 top-0 right-0')} />
        )}
      </div>
    );
  },
);
IconContainer.displayName = 'IconContainer';

export { IconContainer };
