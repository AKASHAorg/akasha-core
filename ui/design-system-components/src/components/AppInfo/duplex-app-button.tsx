import React, { useState } from 'react';

import Button from '@akashaorg/design-system-core/lib/components/Button';

type DuplexAppButtonProps = {
  onUninstall: () => void;
};

export const DuplexAppButton: React.FC<DuplexAppButtonProps> = ({ onUninstall }) => {
  const [showUninstallAppIcon, setShowUninstallAppIcon] = useState(false);

  return (
    <Button
      icon={showUninstallAppIcon ? 'XMarkIcon' : 'CheckIcon'}
      size="xs"
      onMouseEnter={() => {
        setShowUninstallAppIcon(true);
      }}
      onMouseLeave={() => {
        setShowUninstallAppIcon(false);
      }}
      onClick={onUninstall}
    />
  );
};
