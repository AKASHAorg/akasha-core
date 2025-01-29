import * as React from 'react';

import { cn } from '@/library/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-[0.375rem] bg-muted', className)} {...props} />;
}

export { Skeleton };
