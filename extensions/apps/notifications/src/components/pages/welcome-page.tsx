import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRootComponentProps, useAkashaStore, useNotifications } from '@akashaorg/ui-core-hooks';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import NotificationSettingsCard from '@akashaorg/design-system-components/lib/components/NotificationSettingsCard';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type WelcomePageProps = {
  finalStep?: boolean;
};

const WelcomePage: React.FC<WelcomePageProps> = () => {
  const { notificationsEnabled, previouslyEnabled } = useNotifications();
  const { baseRouteName, getCorePlugins } = useRootComponentProps();
  const {
    data: { authenticatedProfile },
  } = useAkashaStore();
  const { t } = useTranslation('app-notifications');
  const navigateTo = getCorePlugins().routing.navigateTo;

  const handleConnectButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (routes: Record<string, string>) => {
        return `${routes.Connect}?${new URLSearchParams({
          redirectTo: `${baseRouteName}`,
        }).toString()}`;
      },
    });
  };

  const handleGoToNotificationsSettings = () => {
    navigateTo?.({
      appName: '@akashaorg/app-settings-ewa',
      getNavigationUrl: navRoutes => navRoutes['Notifications'],
    });
  };

  if (!authenticatedProfile?.did.id)
    return (
      <ErrorLoader
        type="not-authenticated"
        title={`${t('Uh-oh')}! ${t('You are not connected')}!`}
        details={`${t('To check your notifications you must be connected')} ⚡️`}
        dataTestId="notifications"
      >
        <Button onClick={handleConnectButtonClick}>{t('Connect')}</Button>
      </ErrorLoader>
    );

  // notifications can be displayed even if user has not signed them in current session (readOnly mode)
  return notificationsEnabled || previouslyEnabled ? (
    <Stack className="p-4">
      <Text>TODO - Notifications show up here</Text>
    </Stack>
  ) : (
    <NotificationSettingsCard
      image={'notificationsDefault'}
      isLoading={false}
      handleButtonClick={handleGoToNotificationsSettings}
      text={t('Receive personalised updates and community news.')}
      title={t('Turn on in-app notifications')}
      buttonLabel={t('Go to Settings')}
    />
  );
};
export default WelcomePage;
