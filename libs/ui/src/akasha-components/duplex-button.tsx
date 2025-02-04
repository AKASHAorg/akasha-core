import * as React from 'react';

import { Button, ButtonProps } from '@/akasha-components/button';

interface DuplexButtonProps {
  active: boolean;
  children: React.ReactNode;
}

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

const DuplexButton = ({ children, active }: DuplexButtonProps) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <DuplexButtonContext.Provider
      value={{
        active,
        hovered,
        onHovered: hovered => setHovered(hovered),
      }}
    >
      {children}
    </DuplexButtonContext.Provider>
  );
};
DuplexButton.displayName = 'DuplexButton';

const DuplexButtonActive = React.forwardRef<HTMLButtonElement, ButtonProps>(({ ...props }, ref) => {
  const { active, hovered, onHovered } = useDuplexButtonContext();
  return active && !hovered && <Button ref={ref} onMouseEnter={() => onHovered(true)} {...props} />;
});
DuplexButtonActive.displayName = 'DuplexButtonActive';

const DuplexButtonHover = React.forwardRef<HTMLButtonElement, ButtonProps>(({ ...props }, ref) => {
  const { active, hovered, onHovered } = useDuplexButtonContext();
  return active && hovered && <Button ref={ref} onMouseLeave={() => onHovered(false)} {...props} />;
});
DuplexButtonHover.displayName = 'DuplexButtonHover';

const DuplexButtonInactive = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ ...props }, ref) => {
    const { active } = useDuplexButtonContext();
    return !active && <Button ref={ref} {...props} />;
  },
);
DuplexButtonInactive.displayName = 'DuplexButtonInactive';

export { DuplexButton, DuplexButtonActive, DuplexButtonHover, DuplexButtonInactive };
