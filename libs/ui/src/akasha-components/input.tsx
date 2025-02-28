import * as React from 'react';
import { Search } from 'lucide-react';

import { cn } from '@/library/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  const isSearch = type === 'search';
  return (
    <div className="relative">
      <input
        type={type}
        data-slot="input"
        className={cn(
          'peer border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 aria-invalid:outline-destructive/60 dark:aria-invalid:outline-destructive dark:aria-invalid:ring-destructive/40 aria-invalid:ring-destructive/20 aria-invalid:border-destructive/60 dark:aria-invalid:border-destructive flex h-10 w-full min-w-0 rounded-md border bg-card pr-3 py-1 text-base shadow-xs transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-4 focus-visible:outline-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:focus-visible:ring-[3px] aria-invalid:focus-visible:outline-none md:text-sm dark:aria-invalid:focus-visible:ring-4',
          isSearch ? 'pl-10' : 'pl-3',
          className,
        )}
        {...props}
      />
      {isSearch && (
        <Search
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground bg-card peer-focus:text-foreground"
        />
      )}
    </div>
  );
}

export { Input };
