import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { NotificationTypes, NotificationEvents } from '@akashaorg/typings/lib/ui';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import PageLayout from './base-layout';
import { useAkashaStore, useNsfwToggling, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { Switch } from '@akashaorg/ui/lib/components/switch';

const NsfwOption: React.FC = () => {
  const { t } = useTranslation('app-settings-ewa');
  const {
    data: { authenticatedDID, isAuthenticating },
  } = useAkashaStore();
  const isLoggedIn = !!authenticatedDID;
  const { getCorePlugins, uiEvents } = useRootComponentProps();
  const routingPlugin = useRef(getCorePlugins().routing);
  const _uiEvents = React.useRef(uiEvents);
  const { showNsfw, toggleShowNsfw } = useNsfwToggling();
  if (!isLoggedIn && !isAuthenticating) {
    // if not logged in, redirect to homepage
    routingPlugin.current?.navigateTo?.({
      appName: '@akashaorg/app-antenna',
      getNavigationUrl: () => '/',
    });
  }
  const handleNsfwToggle = () => {
    toggleShowNsfw(!showNsfw);
    const notifMsg = t(`NSFW Settings updated`);
    _uiEvents.current.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Success,
        title: notifMsg,
      },
    });
  };
  return (
    <PageLayout title={t('NSFW Content')}>
      <Stack className="p-4">
        <Stack direction="row" justifyContent="between" alignItems="center" className="mb-2">
          <Typography bold>{t('Show NSFW Content')}</Typography>
          <Switch onCheckedChange={handleNsfwToggle} checked={showNsfw} />
        </Stack>

        <Typography>
          {t(
            'If you enable NSFW content, any sensitive content will show up in your search results when you lookup anything.',
          )}
        </Typography>
      </Stack>
    </PageLayout>
  );
};
export default NsfwOption;
