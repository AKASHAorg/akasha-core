import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import {
  Akasha,
  Antenna,
  Vibes,
} from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import { BellIcon, Cog8ToothIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { InstalledExtensions } from '../installed-extensions';

export const InstalledExtensionsPage: React.FC<unknown> = () => {
  const { getRoutingPlugin } = useRootComponentProps();
  const { t } = useTranslation('app-extensions');

  const handleAppClick = (appName: string) => {
    console.log(appName);
    getRoutingPlugin().navigateTo({
      appName,
    });
  };

  const description = t(
    'Play with your friends in AKASHA World and enjoy a couple of puzzle games or drawing games or any kind of game!',
  );

  const defaultExtensions = [
    {
      id: '@akashaorg/app-antenna',
      name: t('Antenna'),
      description,
      icon: <Antenna />,
    },
    {
      id: '@akashaorg/app-vibes',
      name: t('Vibes'),
      description,
      icon: <Vibes />,
    },
    {
      id: '@akashaorg/app-extensions',
      name: t('Extensions'),
      description,
      icon: <Akasha />,
      isSolidIcon: true,
    },
    {
      id: '@akashaorg/app-search',
      name: t('Search'),
      description,
      icon: <MagnifyingGlassIcon />,
    },
    {
      id: '@akashaorg/app-notifications',
      name: t('Notifications'),
      description,
      icon: <BellIcon />,
    },
    {
      id: '@akashaorg/app-settings-ewa',
      name: t('Settings'),
      description,
      icon: <Cog8ToothIcon />,
    },
  ];

  return (
    <InstalledExtensions
      titleLabel={t('Installed Extensions')}
      defaultExtensions={defaultExtensions.map(ext => ({
        ...ext,
        action: (
          <Button variant="secondary" label={t('Open')} onClick={() => handleAppClick(ext.id)} />
        ),
      }))}
      sections={[
        {
          title: '',
          description: '',
        },
        {
          title: t('Default Extensions'),
          description: t(
            'The default extensions are the ones that come preinstalled with AKASHA World. You cannot uninstall them.',
          ),
        },
      ]}
      onAppClick={handleAppClick}
    />
  );
};
