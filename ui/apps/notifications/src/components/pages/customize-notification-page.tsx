import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { EventTypes, MenuItemAreaType } from '@akashaorg/typings/lib/ui';
import { useRootComponentProps, useSaveSettings, useGetSettings } from '@akashaorg/ui-awf-hooks';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Checkbox from '@akashaorg/design-system-core/lib/components/Checkbox';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Toggle from '@akashaorg/design-system-core/lib/components/Toggle';

import routes, {
  CUSTOMIZE_NOTIFICATION_WELCOME_PAGE,
  CUSTOMIZE_NOTIFICATION_CONFIRMATION_PAGE,
  SHOW_NOTIFICATIONS_PAGE,
} from '../../routes';

export type CustomizeNotificationPageProps = {
  initial?: boolean;
  isLoggedIn: boolean;
};
const NOTIF_REF = 'notification-preference';

const CustomizeNotificationPage: React.FC<CustomizeNotificationPageProps> = ({
  initial = true,
  isLoggedIn,
}) => {
  const { t } = useTranslation('app-notifications');
  const { uiEvents, getRoutingPlugin } = useRootComponentProps();

  const [routeData, setRouteData] = useState(null);

  const routing = getRoutingPlugin();

  const [appNames, setAppNames] = useState<string[]>([]);

  const allowedApps = [
    '@akashaorg/app-akasha-integration',
    '@akashaorg/app-moderation-ewa',
    '@akashaorg/app-akasha-verse',
  ];

  useEffect(() => {
    let sub;
    if (routing) {
      sub = routing.routeObserver.subscribe({
        next: routeData => {
          setRouteData({ ...routeData.byArea });
        },
      });
    }
    return () => {
      if (sub) {
        sub.unsubscribe();
      }
    };
  }, [routing]);

  const defaultInstalledApps = useMemo(() => {
    return routeData?.[MenuItemAreaType.AppArea];
  }, [routeData]);

  React.useEffect(() => {
    if (defaultInstalledApps) {
      defaultInstalledApps.map(app => {
        if (allowedApps.includes(app.name)) setAppNames(prev => [...prev, app.label]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultInstalledApps]);

  const [selected, setSelected] = useState(true);
  const [allStates, setAllStates] = useState<{ app: string; selected: boolean }[]>([]);
  const [formatedSettings, setFormatedSettings] = useState(null);

  const appname = '@akashaorg/app-notifications';

  const fetchSettingsQuery = useGetSettings(appname);
  const existingSettings = fetchSettingsQuery.data;

  const saveSettingsMutation = useSaveSettings();
  const saveSettingsRes = saveSettingsMutation.data;

  React.useEffect(() => {
    if (appNames) {
      if (existingSettings && existingSettings.data?.options) {
        const convertToObject = existingSettings.data?.options
          .map(([k, v]) => {
            if (appNames.includes(k)) {
              return {
                app: k,
                selected: v,
              };
            }
            if (k === 'snoozed' && typeof v === 'boolean') {
              setSnoozed(v);
            }
          })
          .filter(item => !!item);

        const mergedArray = [...allStates, ...convertToObject];
        const uniqueData = [
          ...mergedArray.reduce((map, obj) => map.set(obj.app, obj), new Map()).values(),
        ];
        return setAllStates(uniqueData);
      } else {
        setAllStates(appNames.map(app => ({ app: app, selected: true })));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appNames, existingSettings]);

  React.useEffect(() => {
    if (formatedSettings) {
      saveSettingsMutation.mutate(JSON.stringify({ app: appname, options: formatedSettings }));
    }
    if (saveSettingsRes) {
      setFormatedSettings(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingSettings, saveSettingsRes, formatedSettings]);

  const [snoozed, setSnoozed] = React.useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const snoozeChangeHandler = () => {
    setSnoozed(!snoozed);
    setIsChanged(true);
  };

  const navigateTo = getRoutingPlugin().navigateTo;

  // added for emitting snooze notification event
  const _uiEvents = useRef(uiEvents);

  const changeHandler = ({ app }): void => {
    const newStates = allStates?.map(state => {
      if (state.app === app) {
        state.selected = !state.selected;
      }
      return state;
    });

    setAllStates([...newStates]);
    setIsChanged(true);
  };

  // auto-selects all when I want to receive all notification is checked
  useEffect(() => {
    if (selected && isChanged) {
      setAllStates(appNames.map(app => ({ app: app, selected: true })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const goToNextStep = () => {
    // navigate to final step or go back to notifications page depending whether it's the first time accessing the app or not
    return navigateTo?.({
      appName: '@akashaorg/app-notifications',
      getNavigationUrl: () =>
        initial
          ? routes[CUSTOMIZE_NOTIFICATION_CONFIRMATION_PAGE]
          : `${routes[SHOW_NOTIFICATIONS_PAGE]}`,
    });
  };

  const skipHandler = () => {
    if (window.localStorage) {
      localStorage.setItem(NOTIF_REF, JSON.stringify(true));
    }
    setFormatedSettings(allStates?.map(state => Object.values(state)));

    // navigate to final step
    goToNextStep();
  };

  const confirmHandler = () => {
    // @TODO: we save preferences using the settings service, but we also save a key in localstorage to mark as set
    try {
      if (window.localStorage) {
        localStorage.setItem(NOTIF_REF, JSON.stringify(true));
      }

      const allPrefs = allStates?.map(state => Object.values(state));
      allPrefs.push(['snoozed', snoozed]);

      setFormatedSettings(allPrefs);

      _uiEvents.current.next({
        event: EventTypes.ShowNotification,
        data: {
          name: 'success',
          message: 'Notification settings updated successfully',
        },
      });

      if (snoozed) {
        // emit snooze notification event so the topbar's notification icon can be updated
        _uiEvents.current.next({
          event: EventTypes.SnoozeNotifications,
        });
        _uiEvents.current.next({
          event: EventTypes.ShowNotification,
          data: {
            name: 'success',
            message: 'You have snoozed your notifications successfully',
          },
        });
      }

      if (!snoozed) {
        // emit unsnooze notification event so the topbar's notification icon can be updated
        _uiEvents.current.next({
          event: EventTypes.UnsnoozeNotifications,
        });

        _uiEvents.current.next({
          event: EventTypes.ShowNotification,
          data: {
            name: 'success',
            message: 'You have unsnoozed your notifications successfully',
          },
        });
      }

      setIsChanged(false);

      // navigate to final step
      initial && goToNextStep();
    } catch (error) {
      _uiEvents.current.next({
        event: EventTypes.ShowNotification,
        data: {
          name: 'error',
          message: 'Something went wrong. Retry',
        },
      });
    }
  };

  if (!isLoggedIn) {
    return navigateTo?.({
      appName: '@akashaorg/app-notifications',
      getNavigationUrl: () => routes[CUSTOMIZE_NOTIFICATION_WELCOME_PAGE],
    });
  }

  return (
    <>
      <Card
        elevation={'1'}
        radius={16}
        padding={'py-2,px-0'}
        customStyle="h-full md:h-min space-y-4"
      >
        <Text variant="h5" align="center" customStyle="pb-2">
          {initial ? t('Customize Your Notifications') : t('Notifications Settings')}
        </Text>
        <Divider customStyle="!mt-0" />
        <Stack direction="column" customStyle="mx-4 !my-0 py-2">
          {!initial && (
            <>
              <Stack justify="between" direction="row">
                <Text variant="footnotes2">
                  <>{t('Snooze Notifications')}</>
                </Text>
                <Toggle
                  iconChecked="BellSnoozeIcon"
                  iconUnchecked="BellAlertIcon"
                  checked={snoozed}
                  onChange={snoozeChangeHandler}
                />
              </Stack>
            </>
          )}
        </Stack>
        <Divider customStyle="!mt-0" />
        <Stack direction="column" customStyle="mx-4">
          {initial ? (
            <Text variant="footnotes2" weight="normal" color={{ dark: 'grey6', light: 'grey4' }}>
              <>
                {t(
                  'Choose the notifications that you would like to receive from other applications. Remember, you can change this anytime from the notifications settings.',
                )}
              </>
            </Text>
          ) : (
            <Text variant="h6">
              <>{t('Receiving Notifications')}</>
            </Text>
          )}
          <Checkbox
            id="receive-all-notifications-checkbox"
            label={t('I want to receive all types of notifications')}
            value="I want to receive all types of notifications"
            name="check-all"
            isSelected={selected}
            handleChange={() => {
              setSelected(!selected);
              !initial && setIsChanged(true);
            }}
            customStyle="ml-2 my-4"
          />
        </Stack>
        <Divider customStyle="!mt-0" />
        <Stack direction="column" customStyle="min-h-[80%] !mt-0 gap-y-2 pt-2">
          {allStates.length !== 0 &&
            allStates.map(appState => (
              <>
                <Stack direction="row" justify="between" align="center" customStyle="px-6">
                  <Text variant="h6">
                    {appState?.app}- {String(appState.selected)}
                  </Text>
                  <Checkbox
                    value={appState.app}
                    id={appState.app.concat(String(Math.round(Math.random() * 100)))}
                    isSelected={appState.selected}
                    handleChange={() => changeHandler(appState)}
                    name={appState.app}
                    customStyle="mb-4"
                  />
                </Stack>
                <Divider customStyle="!mt-0" />
              </>
            ))}
        </Stack>
        <Stack fullWidth direction="row" justify="end" customStyle="space-x-4 pr-2 pb-2 pt-32">
          {initial ? (
            <>
              <Button
                variant="text"
                label={t('Do it later')}
                color="secondaryLight dark:secondaryDark"
                onClick={skipHandler}
              />
              <Button variant="primary" label={t('Confirm')} onClick={confirmHandler} />
            </>
          ) : (
            <>
              <Button
                variant="text"
                label={t('Cancel')}
                color="secondaryLight dark:secondaryDark"
                onClick={skipHandler}
              />
              <Button
                variant="primary"
                label={t('Update')}
                onClick={confirmHandler}
                disabled={!isChanged}
              />
            </>
          )}
        </Stack>
      </Card>
    </>
  );
};
export default CustomizeNotificationPage;
