import * as React from 'react';

import { Button } from '@/akasha-components/button';

const DuplexButtonContext = React.createContext<{
  active: boolean;
  hovered: boolean;
  onHovered: (value: boolean) => void;
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
  React.ComponentProps<'div'> & { active: boolean; children: React.ReactNode }
>(({ children, active, ...props }, ref) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <DuplexButtonContext.Provider
      value={{
        active,
        hovered,
        onHovered: hovered => setHovered(hovered),
      }}
    >
      <div ref={ref} data-slot="duplex-button" {...props}>
        {children}
      </div>
    </DuplexButtonContext.Provider>
  );
});

const DuplexButtonActive = React.forwardRef<
  React.ElementRef<'button'>,
  React.ComponentProps<'button'> & React.ComponentProps<typeof Button>
>(({ ...props }, ref) => {
  const { active, hovered, onHovered } = useDuplexButtonContext();
  return (
    active &&
    !hovered && (
      <Button
        ref={ref}
        data-slot="duplex-button-active"
        onMouseEnter={() => onHovered(true)}
        {...props}
      />
    )
  );
});

const DuplexButtonHover = React.forwardRef<
  React.ElementRef<'button'>,
  React.ComponentProps<'button'> & React.ComponentProps<typeof Button>
>(({ ...props }, ref) => {
  const { active, hovered, onHovered } = useDuplexButtonContext();
  return (
    active &&
    hovered && (
      <Button
        ref={ref}
        data-slot="duplex-button-hover"
        onMouseLeave={() => onHovered(false)}
        {...props}
      />
    )
  );
});

const DuplexButtonInactive = React.forwardRef<
  React.ElementRef<'button'>,
  React.ComponentProps<'button'> & React.ComponentProps<typeof Button>
>(({ ...props }, ref) => {
  const { active } = useDuplexButtonContext();
  return !active && <Button ref={ref} data-slot="duplex-button-inactive" {...props} />;
});

export { DuplexButton, DuplexButtonActive, DuplexButtonHover, DuplexButtonInactive };
