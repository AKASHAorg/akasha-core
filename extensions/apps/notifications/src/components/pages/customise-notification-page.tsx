import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  useSyncExternalStore,
} from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItemAreaType, NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';
import {
  useRootComponentProps,
  useSaveSettings,
  useGetSettings,
  useAkashaStore,
} from '@akashaorg/ui-core-hooks';

import { Switch } from '@akashaorg/ui/lib/components/switch';

import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Checkbox } from '@akashaorg/ui/lib/components/checkbox';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import routes, {
  CUSTOMISE_NOTIFICATION_WELCOME_PAGE,
  CUSTOMISE_NOTIFICATION_CONFIRMATION_PAGE,
  SHOW_NOTIFICATIONS_PAGE,
} from '../../routes';
import { useNavigate } from '@tanstack/react-router';
export type CustomiseNotificationPageProps = {
  initial?: boolean;
};
export const NOTIF_REF = 'notification-preference-set';
const Appname = '@akashaorg/app-notifications';
const SnoozeOption = 'snoozed';
const CustomiseNotificationPage: React.FC<CustomiseNotificationPageProps> = ({
  initial = true,
}) => {
  const { t } = useTranslation('app-notifications');
  const { uiEvents, getCorePlugins } = useRootComponentProps();
  const navigate = useNavigate();
  const {
    data: { authenticatedDID, isAuthenticating: loading },
  } = useAkashaStore();
  const isLoggedIn = !!authenticatedDID;
  const fetchSettingsQuery = useGetSettings(Appname);
  const existingSettings: {
    [k: string]: string | number | boolean;
  } | null = fetchSettingsQuery.data;
  const { saveNotificationSettings } = useSaveSettings();
  const routeData = useSyncExternalStore(
    getCorePlugins().routing.subscribe,
    getCorePlugins().routing.getSnapshot,
  );
  const [appNames, setAppNames] = useState<string[]>([]);
  const allowedApps = React.useMemo(
    () => ['@akashaorg/app-antenna', '@akashaorg/app-vibes', '@akashaorg/app-extensions'],
    [],
  );
  const defaultInstalledApps = useMemo(() => {
    return routeData?.byArea?.[MenuItemAreaType.AppArea];
  }, [routeData]);
  React.useEffect(() => {
    if (defaultInstalledApps) {
      defaultInstalledApps.map(app => {
        if (allowedApps.includes(app.name)) setAppNames(prev => [...prev, app.label]);
      });
    }
  }, [allowedApps, defaultInstalledApps]);
  const [selected, setSelected] = useState(false);
  const [allStates, setAllStates] = useState<{
    [k: string]: string | number | boolean;
  }>({});
  const [saveSettingsLoading, setSaveSettingsLoading] = useState(false);
  const setDefaultValues = useCallback(() => {
    setAllStates(Object.fromEntries(appNames.map(app => [[app], true])));
  }, [appNames]);
  React.useEffect(() => {
    if (appNames) {
      if (existingSettings) {
        const appStates = Object.fromEntries(
          Object.entries(existingSettings).filter(app => appNames.includes(app[0])),
        );
        Object.keys(appStates).length !== 0 ? setAllStates(appStates) : setDefaultValues();
        const snoozePref = Object.entries(existingSettings).find(key => key.includes(SnoozeOption));
        if (snoozePref && typeof snoozePref[1] === 'boolean') {
          setSnoozed(snoozePref[1]);
        }
      } else {
        setDefaultValues();
      }
    }
  }, [appNames, existingSettings, setDefaultValues]);
  const [snoozed, setSnoozed] = React.useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const snoozeChangeHandler = () => {
    setSnoozed(!snoozed);
    setIsChanged(true);
  };

  // added for emitting snooze notification event
  const _uiEvents = useRef(uiEvents);
  const changeHandler = (appName): void => {
    const newStates = Object.entries(allStates).map(state => {
      if (state[0] === appName) {
        state[1] = !state[1];
      }
      return state;
    });
    setAllStates(Object.fromEntries(newStates));
    setIsChanged(true);
  };

  // auto-selects all when I want to receive all notification is checked
  useEffect(() => {
    if (selected) {
      setAllStates(Object.fromEntries(appNames.map(app => [[app], true])));
    }
  }, [appNames, selected]);
  React.useEffect(() => {
    if (Object.keys(allStates).length !== 0) {
      if (Object.entries(allStates).filter(app => app[1] === false).length > 0) {
        setSelected(false);
      } else {
        setSelected(true);
      }
    }
  }, [allStates]);
  const goToNextStep = () => {
    // navigate to final step or go back to notifications page depending whether it's the first time accessing the app or not
    navigate({
      to: initial
        ? routes[CUSTOMISE_NOTIFICATION_CONFIRMATION_PAGE]
        : `${routes[SHOW_NOTIFICATIONS_PAGE]}`,
    });
  };
  const skipHandler = () => {
    setAllStates(Object.fromEntries(appNames.map(app => [[app], true])));

    // navigate to final step
    goToNextStep();
  };
  const confirmHandler = () => {
    setSaveSettingsLoading(true);
    try {
      const allPrefs = structuredClone(allStates);

      //add snooze pref
      allPrefs[SnoozeOption] = snoozed;
      saveNotificationSettings(
        {
          app: Appname,
          options: allPrefs,
        },
        {
          onComplete: () => setSaveSettingsLoading(false),
        },
      );
      if (snoozed) {
        // emit snooze notification event so the topbar's notification icon can be updated
        _uiEvents.current.next({
          event: NotificationEvents.SnoozeNotifications,
        });
        _uiEvents.current.next({
          event: NotificationEvents.ShowNotification,
          data: {
            type: NotificationTypes.Success,
            title: 'You have snoozed your notifications successfully',
          },
        });
      }
      if (!snoozed) {
        // emit unsnooze notification event so the topbar's notification icon can be updated
        _uiEvents.current.next({
          event: NotificationEvents.UnsnoozeNotifications,
        });
        _uiEvents.current.next({
          event: NotificationEvents.ShowNotification,
          data: {
            type: NotificationTypes.Success,
            title: 'You have unsnoozed your notifications successfully',
          },
        });
      }
      _uiEvents.current.next({
        event: NotificationEvents.ShowNotification,
        data: {
          type: NotificationTypes.Success,
          title: 'Notification settings updated successfully',
        },
      });
      setIsChanged(false);

      // navigate to final step
      initial && goToNextStep();
    } catch (error) {
      setSaveSettingsLoading(false);
      _uiEvents.current.next({
        event: NotificationEvents.ShowNotification,
        data: {
          type: NotificationTypes.Error,
          title: 'Something went wrong. Retry',
        },
      });
    }
  };
  if (!isLoggedIn && !loading) {
    navigate({
      to: routes[CUSTOMISE_NOTIFICATION_WELCOME_PAGE],
    });
  }
  return (
    <Card className="h-full md:h-min space-y-4 rounded-2xl py-2 px-0">
      <Typography variant="h5" className="text-center pb-2">
        {initial ? t('Customise Your Notifications') : t('Notification Settings')}
      </Typography>
      <Divider customStyle="!mt-0" />
      {!initial && (
        <>
          <Stack direction="column" className="px-6 !my-0 py-2">
            <>
              <Stack justifyContent="between" direction="row">
                <Typography variant="xs" className="font-medium">
                  <>{t('Snooze Notifications')}</>
                </Typography>
                <Switch checked={snoozed} onCheckedChange={snoozeChangeHandler} />
              </Stack>
            </>
          </Stack>
          <Divider customStyle="!mt-0" />
        </>
      )}
      <Stack direction="column" className="mx-4">
        {initial ? (
          <Typography variant="xs" className="font-medium font-normal text-grey4 dark:text-grey6">
            <>
              {t(
                'Choose the notifications that you would like to receive from other applications. Remember, you can change this anytime from the notifications settings.',
              )}
            </>
          </Typography>
        ) : (
          <Typography variant="h6">
            <>{t('Receiving Notifications')}</>
          </Typography>
        )}
        <Stack direction="row" alignItems="center" spacing={2} className="ml-2 my-4">
          <Checkbox
            id="receive-all-notifications-checkbox"
            name="check-all"
            value="I want to receive all types of notifications"
            checked={selected}
            onCheckedChange={() => {
              setSelected(!selected);
              !initial && setIsChanged(true);
            }}
          />
          <label htmlFor="receive-all-notifications-checkbox">
            <Typography variant="sm">
              {t('I want to receive all types of notifications')}
            </Typography>
          </label>
        </Stack>
      </Stack>
      <Divider customStyle="!mt-0" />
      <Stack direction="column" className="min-h-[80%] !mt-0 gap-y-2 pt-2">
        {Object.keys(allStates).length > 0 &&
          !Object.keys(allStates).find(key => key === SnoozeOption) &&
          Object.entries(allStates).map(appState => (
            <Stack
              direction="column"
              key={appState[0].concat(String(Math.round(Math.random() * 100)))}
            >
              <Stack direction="row" justifyContent="between" alignItems="center" className="px-6">
                <Typography variant="h6">{appState[0]}</Typography>
                <Checkbox
                  value={appState[0]}
                  id={appState[0].concat(String(Math.round(Math.random() * 100)))}
                  name={appState[0]}
                  checked={Boolean(appState[1])}
                  onCheckedChange={() => changeHandler(appState[0])}
                />
              </Stack>
              <Divider customStyle="!mt-0" />
            </Stack>
          ))}
      </Stack>
      {!saveSettingsLoading && (
        <Stack direction="row" justifyContent="end" className="w-full space-x-4 pr-2 pb-2 pt-32">
          {initial ? (
            <>
              <Button variant="link" onClick={skipHandler}>
                {t('Do it later')}
              </Button>
              <Button onClick={confirmHandler}>{t('Confirm')}</Button>
            </>
          ) : (
            <>
              <Button variant="link" onClick={skipHandler}>
                {t('Cancel')}
              </Button>
              <Button onClick={confirmHandler} disabled={!isChanged}>
                {t('Update')}
              </Button>
            </>
          )}
        </Stack>
      )}
    </Card>
  );
};
export default CustomiseNotificationPage;
