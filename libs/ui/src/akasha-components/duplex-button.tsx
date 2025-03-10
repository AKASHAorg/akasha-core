import * as React from 'react';

import { Button } from '@/akasha-components/button';
import { cn } from '@/library/utils';

const DuplexButtonContext = React.createContext<{
  active: boolean;
  size: React.ComponentProps<typeof Button>['size'];
  loading?: boolean;
  disabled?: boolean;
} | null>(null);

const useDuplexButtonContext = () => {
  const context = React.useContext(DuplexButtonContext);
  if (!context) {
    throw new Error('`useDuplexButtonContext` must be used within `DuplexButton`');
  }
  return context;
};

const DuplexButton = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentProps<'div'> & {
    active: boolean;
    size?: React.ComponentProps<typeof Button>['size'];
    loading?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
  }
>(({ size = 'default', active, loading, disabled, className, children, ...props }, ref) => {
  return (
    <DuplexButtonContext.Provider
      value={{
        active,
        size,
        loading,
        disabled,
      }}
    >
      <div
        ref={ref}
        data-slot="duplex-button"
        className={cn('group/duplex-button [&_button]:w-full space-2', className)}
        {...props}
      >
        {children}
      </div>
    </DuplexButtonContext.Provider>
  );
});

const DuplexButtonActive = React.forwardRef<
  React.ElementRef<'button'>,
  React.ComponentProps<'button'> & React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { active, loading, disabled, size } = useDuplexButtonContext();
  if (!active) return null;
  return (
    <Button
      ref={ref}
      data-slot="duplex-button-active"
      loading={loading}
      disabled={disabled}
      size={size}
      className={cn(
        {
          'group-hover/duplex-button:hidden': !loading && !disabled,
        },
        className,
      )}
      {...props}
    />
  );
});

const DuplexButtonHover = React.forwardRef<
  React.ElementRef<'button'>,
  React.ComponentProps<'button'> & React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { active, loading, disabled, size } = useDuplexButtonContext();
  if (loading || disabled || !active) return null;
  return (
    <Button
      ref={ref}
      data-slot="duplex-button-hover"
      size={size}
      className={cn(
        'hidden group-hover/duplex-button:flex border border-destructive text-destructive bg-transparent hover:bg-transparent',
        className,
      )}
      {...props}
    />
  );
});

const DuplexButtonInactive = React.forwardRef<
  React.ElementRef<'button'>,
  React.ComponentProps<'button'> & React.ComponentProps<typeof Button>
>((props, ref) => {
  const { active, loading, disabled, size } = useDuplexButtonContext();
  if (active) return null;
  return (
    <Button
      ref={ref}
      data-slot="duplex-button-inactive"
      size={size}
      loading={loading}
      disabled={disabled}
      {...props}
    />
  );
});

export { DuplexButton, DuplexButtonActive, DuplexButtonHover, DuplexButtonInactive };
