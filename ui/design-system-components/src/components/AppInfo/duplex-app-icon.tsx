import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import React, { useState } from 'react';

type DuplexAppIconProps = {
  onUninstall: () => void;
};

export const DuplexAppIcon: React.FC<DuplexAppIconProps> = ({ onUninstall }) => {
  const [showUninstallAppIcon, setShowUninstallAppIcon] = useState(false);

  return (
    <AppIcon
      placeholderIconType={showUninstallAppIcon ? 'XMarkIcon' : 'CheckIcon'}
      iconColor={showUninstallAppIcon ? { light: 'errorLight', dark: 'errorDark' } : 'white'}
      background={
        showUninstallAppIcon ? { light: 'errorLight/30', dark: 'errorDark/30' } : 'secondaryDark'
      }
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
