import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CircleAlert, CircleCheck, CircleX } from 'lucide-react';

import { cn } from '@/library/utils';
import { typographyVariants } from '@/akasha-components/typography';

const inlineNotificationVariants = cva(
  'relative bg-background text-foreground w-full rounded-lg border px-4 py-3 grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5',
  {
    variants: {
      variant: {
        info: '',
        success: '',
        destructive: '',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

const variantToIconMap = {
  info: <CircleAlert size={16} className="text-primary" />,
  success: <CircleCheck size={16} className="text-success" />,
  destructive: <CircleX size={16} className="text-destructive" />,
};

const InlineNotification = ({
  className,
  variant = 'info',
  children,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof inlineNotificationVariants>) => (
  <div
    data-slot="inline-notification"
    role="alert"
    className={cn(inlineNotificationVariants({ variant }), className)}
    {...props}
  >
    {variant && variantToIconMap[variant]}
    {children}
  </div>
);

const InlineNotificationTitle = ({ className, ...props }: React.ComponentProps<'h5'>) => (
  <h5
    data-slot="inline-notification-title"
    className={cn(
      'col-start-2 line-clamp-1 min-h-4',
      typographyVariants({ variant: 'sm' }),
      'font-bold',
      className,
    )}
    {...props}
  >
    {props.children}
  </h5>
);

const InlineNotificationDescription = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div
    data-slot="inline-notification-description"
    className={cn(
      'col-start-2 grid justify-items-start gap-1',
      typographyVariants({ variant: 'sm' }),
      className,
    )}
    {...props}
  />
);

export { InlineNotification, InlineNotificationTitle, InlineNotificationDescription };
