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

const DuplexButton = ({
  children,
  active,
  ...props
}: React.ComponentProps<'div'> & {
  active: boolean;
  children: React.ReactNode;
}) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <DuplexButtonContext.Provider
      data-slot="duplex-button"
      value={{
        active,
        hovered,
        onHovered: hovered => setHovered(hovered),
      }}
    >
      <div {...props}>{children}</div>
    </DuplexButtonContext.Provider>
  );
};

const DuplexButtonActive = ({
  ...props
}: React.ComponentProps<'button'> & React.ComponentProps<typeof Button>) => {
  const { active, hovered, onHovered } = useDuplexButtonContext();
  return (
    active &&
    !hovered && (
      <Button data-slot="duplex-button-active" onMouseEnter={() => onHovered(true)} {...props} />
    )
  );
};

const DuplexButtonHover = ({
  ...props
}: React.ComponentProps<'button'> & React.ComponentProps<typeof Button>) => {
  const { active, hovered, onHovered } = useDuplexButtonContext();
  return (
    active &&
    hovered && (
      <Button data-slot="duplex-button-hover" onMouseLeave={() => onHovered(false)} {...props} />
    )
  );
};

const DuplexButtonInactive = ({
  ...props
}: React.ComponentProps<'button'> & React.ComponentProps<typeof Button>) => {
  const { active } = useDuplexButtonContext();
  return !active && <Button data-slot="duplex-button-inactive" {...props} />;
};

export { DuplexButton, DuplexButtonActive, DuplexButtonHover, DuplexButtonInactive };
