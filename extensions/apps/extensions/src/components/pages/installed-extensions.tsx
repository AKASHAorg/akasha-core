import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { InstalledExtensions } from '../installed-extensions';
import routes, { EXTENSIONS } from '../../routes';

export const InstalledExtensionsPage: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const { getRoutingPlugin } = useRootComponentProps();
  const { t } = useTranslation('app-extensions');

  const handleAppClick = (appName: string) => {
    getRoutingPlugin().navigateTo({
      appName,
    });
  };

  const handleClickDiscover = () => {
    navigate({
      to: routes[EXTENSIONS],
    });
  };
  // @TODO fetch real data
  const installedExtensions = [];

  const defaultExtensions = [];

  const addAction = ext => ({
    ...ext,
    action: <Button variant="secondary" label={t('Open')} onClick={() => handleAppClick(ext.id)} />,
  });

  return (
    <InstalledExtensions
      titleLabel={t('Installed Extensions')}
      installedExtensions={installedExtensions.map(addAction)}
      defaultExtensions={defaultExtensions.map(addAction)}
      sections={[
        {
          assetName: 'longbeam-notfound',
          title: t('No extensions installed yet!'),
          discoverLabel: t('Discover'),
          description: t('cool extensions and install them'),
          description2: t('to customize your world'),
          onClickDiscover: handleClickDiscover,
        },
        {
          title: t('Default Extensions'),
          description: t(
            'The default extensions are the ones that come preinstalled with AKASHA World. You cannot uninstall them.',
          ),
        },
      ]}
    />
  );
};
