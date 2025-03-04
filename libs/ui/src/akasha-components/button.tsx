import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '@/library/utils';
import { typographyVariants } from '@/akasha-components/typography';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-bold transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-primary-start to-primary-end text-primary-foreground hover:opacity-70',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-card text-secondary-foreground hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const Button = React.forwardRef<
  React.ElementRef<'button'>,
  React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
      loading?: boolean;
      asChild?: boolean;
    }
>(
  (
    {
      className,
      variant,
      size = 'default',
      loading,
      asChild = false,
      type = 'button',
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(
          {
            [typographyVariants({ variant: 'sm' })]: size === 'default',
            [typographyVariants({ variant: 'xs' })]: size === 'sm',
          },
          buttonVariants({ variant, size, className }),
          { 'p-0': variant === 'link' && asChild },
        )}
        type={type}
        disabled={loading || disabled}
        {...props}
      >
        {loading ? <Loader2 className="animate-spin" /> : children}
      </Comp>
    );
  },
);

export { Button, buttonVariants };
