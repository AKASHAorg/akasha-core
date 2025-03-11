import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { useAkashaStore, useNotifications, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { tw } from '@twind/core';
import {
  ErrorLoader,
  ErrorLoaderDescription,
  ErrorLoaderTitle,
  ErrorLoaderFooter,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import appRoutes, { PREFERENCES } from '../../../routes';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';
import getSDK from '@akashaorg/core-sdk';
import { UserSetting } from '@pushprotocol/restapi/src/lib';
import UnlockCard from './unlock-card';
import EnableAllSetting from './enable-all-setting';
import { getAppInfoFromUserSetting, AppInfo, getAppInfoFromChannelSetting } from './utils';
import LoadingSettingsPlaceholder from './loading-settings-placeholder';
import ConnectErrorCard from '@akashaorg/design-system-components/lib/components/ConnectErrorCard';
import AppSetting from './app-setting';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { Info } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';

const NotificationsPreferencesOption: React.FC = () => {
  const sdk = getSDK();
  const { notificationsEnabled, waitingForSignature, readOnlyMode, enableNotifications } =
    useNotifications();
  const { baseRouteName, uiEvents, getCorePlugins } = useRootComponentProps();
  const _uiEvents = React.useRef(uiEvents);
  const navigateTo = getCorePlugins().routing.navigateTo;
  const { t } = useTranslation('app-settings-ewa');
  const {
    data: { authenticatedDID, isAuthenticating },
  } = useAkashaStore();
  const isLoggedIn = !!authenticatedDID;

  const [appPreferences, setAppPreferences] = useState<AppInfo[]>([]);
  const [enableAllChecked, setEnableAllChecked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [errorInFetchingPreferences, setErrorInFetchingPreferences] = useState<boolean>(false);

  useEffect(() => {
    if ((notificationsEnabled || readOnlyMode) && initialLoading) {
      /**
       * Note: The PushProtocol API does not automatically subscribe the user to all channel notifications.
       *
       * When fetching the user's notification settings via `getSettingsOfUser()`, an empty array may be returned
       * if the user has not explicitly opted in to any notifications. In this case, we:
       *   1. Fetch the default channel settings using `getSettingsOfChannel()`.
       *   2. Mark these channel notifications as not selected (disabled) so that the user must perform
       *      an additional action to enable them.
       */
      sdk.services.common.notification
        .getSettingsOfUser()
        .then(async fetchedPreferences => {
          if (fetchedPreferences.length > 0) {
            setAppPreferences(getAppInfoFromUserSetting(fetchedPreferences, t));
          } else {
            const channelSettings = await sdk.services.common.notification.getSettingsOfChannel();
            setAppPreferences(getAppInfoFromChannelSetting(channelSettings, false, t));
          }
          setInitialLoading(false);
        })
        .catch(() => {
          setErrorInFetchingPreferences(true);
          setInitialLoading(false);
        });
    }
  }, [sdk.services.common.notification, notificationsEnabled, readOnlyMode, initialLoading, t]);

  useEffect(() => {
    setEnableAllChecked(appPreferences?.every(item => item.enabled === true));
  }, [appPreferences]);

  const handleConnectButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (routes: Record<string, string>) => {
        return `${routes.Connect}?${new URLSearchParams({
          redirectTo: `${baseRouteName}/${appRoutes[PREFERENCES]}`,
        }).toString()}`;
      },
    });
  };

  const handleUnlockPreferences = async () => {
    const enabled = await enableNotifications();
    if (!enabled) {
      _uiEvents.current.next({
        event: NotificationEvents.ShowNotification,
        data: {
          type: NotificationTypes.Error,
          title: t('Couldn’t unlock preferences'),
          description: enabled ? undefined : t('Signature verification failed. Please try again.'),
        },
      });
    }
  };

  const handleToggleAll = (val: boolean) => {
    setAppPreferences(
      appPreferences.map(appPreference => {
        return { ...appPreference, enabled: val };
      }),
    );
    setEnableAllChecked(val);
  };

  const handleSetPreference = (value: boolean, index: number) => {
    setAppPreferences(prevState =>
      prevState?.map((item, idx) => (idx === index ? { ...item, enabled: value } : item)),
    );
  };

  const handleReset = () => {
    setAppPreferences(
      appPreferences.map(appPreference => {
        return { ...appPreference, enabled: false };
      }),
    );
  };

  const handleSave = async () => {
    let success: boolean = undefined;
    setLoading(true);
    const preferencesPayload: UserSetting[] = appPreferences?.map(({ enabled }) => ({
      enabled,
    }));

    success = await sdk.services.common.notification.setSettings(preferencesPayload);

    _uiEvents.current.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: success ? NotificationTypes.Success : NotificationTypes.Error,
        title: success ? t('Notification preferences saved') : t('Couldn’t save preferences'),
        description: success ? undefined : t('Signature verification failed. Please try again.'),
      },
    });
    setLoading(false);
  };

  if (!isLoggedIn && !isAuthenticating) {
    return (
      <Stack>
        <ErrorLoader type="not-authenticated">
          <ErrorLoaderTitle>{t('Uh-oh! You are not connected!')}</ErrorLoaderTitle>
          <ErrorLoaderDescription>
            {t('To check notifications preferences options you must be connected ⚡️')}
          </ErrorLoaderDescription>
          <ErrorLoaderFooter>
            <Button onClick={handleConnectButtonClick}>{t('Connect')}</Button>
          </ErrorLoaderFooter>
        </ErrorLoader>
      </Stack>
    );
  }

  return (
    <Stack spacing={4} className="mb-2">
      {!errorInFetchingPreferences && (
        <>
          {/* This case happens only if the Channel creator has not inserted any apps */}
          {appPreferences.length === 0 && !initialLoading && (
            // card background={{ light: 'grey9', dark: 'grey3' }} padding="p-3"
            <Card>
              <Text>{t('There are no apps to subscribe')}</Text>
            </Card>
          )}
          {appPreferences.length > 0 && (
            <>
              <Text variant="h5">{t('Notification Preferences')}</Text>
              {!notificationsEnabled && (
                <UnlockCard onClick={handleUnlockPreferences} loading={waitingForSignature} />
              )}
              <Card
                className={tw(`${!notificationsEnabled && 'opacity-50 pointer-events-none'} p-0`)}
              >
                <Stack className="p-4 pt-0">
                  <EnableAllSetting
                    isSelected={enableAllChecked}
                    onChange={e => handleToggleAll(e.target.checked)}
                  />
                  <Text variant="h6" customStyle="mb-4">
                    {t('Default Extensions')}
                  </Text>
                  {initialLoading ? (
                    <LoadingSettingsPlaceholder />
                  ) : (
                    <>
                      {appPreferences.map((appInfo, index) => (
                        <>
                          <AppSetting
                            key={appInfo.index}
                            title={appInfo.title}
                            description={appInfo.description}
                            isSelected={appInfo.enabled}
                            onChange={e => handleSetPreference(e.target.checked, index)}
                          />
                          {appPreferences.length - 1 !== index && (
                            <Divider customStyle={`dark:border-grey5 my-4`} />
                          )}
                        </>
                      ))}
                      <Card className="mt-4 bg-grey9 dark:bg-grey3">
                        <Stack direction="row" spacing={3} alignItems="center">
                          <Icon
                            icon={<Info />}
                            size="lg"
                            solid={true}
                            color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                          />
                          <Text variant="body1" customStyle="text-sm">
                            {t('Changing notifications preferences requires a signature')}
                          </Text>
                        </Stack>
                      </Card>
                    </>
                  )}
                </Stack>

                {/* Buttons */}
                <Stack
                  direction="row"
                  className="border-t border-border py-4 px-3"
                  justifyContent="end"
                >
                  <Button
                    variant="link"
                    onClick={handleReset}
                    color="dark:secondaryLight secondaryDark"
                    className="mr-4"
                  >
                    {t('Reset')}
                  </Button>
                  <Button
                    onClick={handleSave}
                    color="dark:secondaryLight secondaryDark"
                    loading={loading}
                  >
                    {t('Save')}
                  </Button>
                </Stack>
              </Card>
            </>
          )}
        </>
      )}
      {errorInFetchingPreferences && !initialLoading && (
        <>
          <ConnectErrorCard
            title={t('Failed')}
            message={t('Error in fetching preferences')}
          ></ConnectErrorCard>
        </>
      )}
    </Stack>
  );
};

export default NotificationsPreferencesOption;
