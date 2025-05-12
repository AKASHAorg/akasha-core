import * as React from 'react';

import { cn } from '@/library/utils';
import { CircularProgress } from '@/akasha-components/circular-progress';

const Textarea = React.forwardRef<
  React.ElementRef<'textarea'>,
  React.ComponentProps<'textarea'> & { maxLength?: number }
>(({ maxLength = 280, className, ...props }, ref) => {
  const [letterCount, setLetterCount] = React.useState(props.value?.toString().length || 0);

  const progressValue = Math.min(Math.floor((letterCount / maxLength) * 100), 100);

  return (
    <div className="relative w-full max-w-full">
      <textarea
        data-slot="textarea"
        maxLength={maxLength}
        className={cn(
          'border-input placeholder:text-muted-foreground ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 aria-invalid:outline-destructive/60 dark:aria-invalid:outline-destructive dark:aria-invalid:ring-destructive/40 aria-invalid:ring-destructive/20 aria-invalid:border-destructive/60 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/50 wrap-anywhere flex field-sizing-content min-h-16 w-full rounded-md border bg-card pr-10 pl-3 py-2 text-base shadow-xs transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:focus-visible:ring-[3px] aria-invalid:focus-visible:outline-none md:text-sm dark:aria-invalid:focus-visible:ring-4',
          className,
        )}
        style={{
          wordBreak: 'break-word',
        }}
        onChange={event => {
          setLetterCount(event.target.value.length);
          props.onChange?.(event);
        }}
        {...props}
      />
      <CircularProgress
        value={progressValue}
        className="absolute bottom-2 right-2 pointer-events-none"
      />
    </div>
  );
});

export { Textarea };
