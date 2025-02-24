import * as React from 'react';

import { cn } from '@/ui/library/utils';
import { typographyVariants } from '@akashaorg/ui/lib/akasha-components/typography';

const MAX = 100;

const CIRCLE_SIZE = 24;

const SIZE = CIRCLE_SIZE + 10;

const RADIUS = SIZE / 2 - 5;

const CircularProgress = ({
  value = 0,
  className,
  ...props
}: React.ComponentProps<'div'> & { value?: number }) => {
  const percentage = Math.min(Math.max(value, 0), MAX);
  const circumference = 2 * Math.PI * RADIUS;
  const offset = circumference - (percentage / MAX) * circumference;

  const getColor = React.useCallback(() => {
    if (value < 100) return 'stroke-primary';
    if (value === 100) return 'stroke-warning';
    return 'stroke-destructive';
  }, [value]);

  const label = React.useMemo(() => {
    if (value === 100) return 1;
    if (value > 100) return -1;
    return '';
  }, [value]);

  return (
    <div
      data-slot="circular-progress"
      className={cn('relative flex items-center justify-center', className)}
      {...props}
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className={cn('rotate-[0deg]')}
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          strokeWidth="2"
          className={cn('stroke-muted fill-none')}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke="currentColor"
          strokeWidth="2"
          className={cn('fill-none transition-all', getColor())}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      {label && (
        <p className={cn('absolute text-foreground', typographyVariants({ variant: 'xs' }))}>
          {label}
        </p>
      )}
    </div>
  );
};

export { CircularProgress };
