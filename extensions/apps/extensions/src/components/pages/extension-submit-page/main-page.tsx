import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { Outlet } from '@tanstack/react-router';
import appRoutes, { SUBMIT_EXTENSION } from '../../../routes';
import { useTranslation } from 'react-i18next';
import { useAkashaStore, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Button from '@akashaorg/design-system-core/lib/components/Button';

type ExtensionSubmitMainPageProps = {
  extensionId: string;
};

export const ExtensionSubmitMainPage: React.FC<ExtensionSubmitMainPageProps> = ({
  extensionId,
}) => {
  const { t } = useTranslation('app-extensions');

  const { baseRouteName, getCorePlugins } = useRootComponentProps();

  const navigateTo = getCorePlugins().routing.navigateTo;

  const {
    data: { authenticatedDID },
  } = useAkashaStore();

  const handleConnectButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (routes: Record<string, string>) => {
        return `${routes.Connect}?${new URLSearchParams({
          redirectTo: `${baseRouteName}/${appRoutes[SUBMIT_EXTENSION]}/${extensionId}`,
        }).toString()}`;
      },
    });
  };

  if (!authenticatedDID) {
    return (
      <ErrorLoader
        type="not-authenticated"
        title={`${t('Uh-oh')}! ${t('You are not connected')}!`}
        details={`${t('To check your extensions you must be connected')} ⚡️`}
      >
        <Button variant="primary" label={t('Connect')} onClick={handleConnectButtonClick} />
      </ErrorLoader>
    );
  }

  return (
    <Card padding={0}>
      <Outlet />
    </Card>
  );
};
