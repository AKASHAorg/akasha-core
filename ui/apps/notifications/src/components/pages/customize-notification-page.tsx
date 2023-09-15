import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { EventTypes } from '@akashaorg/typings/lib/ui';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

import Accordion from '@akashaorg/design-system-core/lib/components/Accordion';
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

const Title = ({ title }: { title: string }): JSX.Element => {
  return (
    <Stack direction="row" justifyItems="center">
      <Text variant="h6" align="center">
        {title}
      </Text>
    </Stack>
  );
};

const CustomizeNotificationPage: React.FC<CustomizeNotificationPageProps> = ({
  initial = true,
  isLoggedIn,
}) => {
  const { t } = useTranslation('app-notifications');
  const { uiEvents, getRoutingPlugin } = useRootComponentProps();

  const [selected, setSelected] = useState(true);

  const socialAppCheckboxes = useMemo(
    () => [
      {
        label: t('New Followers'),
        value: 'New Followers',
        selected: true,
      },
      {
        label: t('Reflects on my Beam'),
        value: 'Reflects on my Beam',
        selected: true,
      },
      {
        label: t('Mentions me in a Beam / Reflect'),
        value: 'Mentions me in a Beam / Reflect',
        selected: true,
      },
      {
        label: t('Someone sharing my Beam'),
        value: 'Someone sharing my Beam',
        selected: true,
      },
      {
        label: t('When someone I am following Beams new content'),
        value: 'When someone I am following Beams new content',
        selected: true,
      },
      {
        label: t('When there’s new content in topics I’m subscribed to'),
        value: 'When there’s new content in topics I’m subscribed to',
        selected: true,
      },
    ],
    [t],
  );

  const moderationAppCheckboxes = useMemo(
    () => [
      {
        label: t('My content gets delisted/kept'),
        value: 'My content gets delisted/kept',
        selected: true,
      },
    ],
    [t],
  );
  const integrationCenterCheckboxes = useMemo(
    () => [
      {
        label: t('New versions of installed integrations'),
        value: 'New versions of installed integrations',
        selected: true,
      },
    ],
    [t],
  );

  const [allStates, setAllStates] = useState({
    socialapp: socialAppCheckboxes.map(e => e.selected),
    moderationApp: moderationAppCheckboxes.map(e => e.selected),
    integrationCenter: integrationCenterCheckboxes.map(e => e.selected),
  });

  const [snoozed, setSnoozed] = React.useState(false);

  // check if snooze notification option has already been set
  useEffect(() => {
    if (window.localStorage) {
      setSnoozed(JSON.parse(localStorage.getItem('notifications-snoozed')));
    }
  }, []);

  //for the button, disabled when no change made, enabled when there's an change
  // const [updateButtonDisabled, setUpdateButtonDisabled] = useState(true);
  const [isChanged, setIsChanged] = useState(false);

  const snoozeChangeHandler = () => {
    setSnoozed(!snoozed);
    setIsChanged(true);
  };

  const navigateTo = getRoutingPlugin().navigateTo;

  // added for emitting snooze notification event
  const _uiEvents = useRef(uiEvents);

  const changeHandler = (pos: number, section: string): void => {
    const stateArray = (() => {
      switch (section) {
        case 'socialapp':
          return allStates.socialapp;
        case 'moderationApp':
          return allStates.moderationApp;
        case 'integrationCenter':
          return allStates.integrationCenter;
      }
    })();
    const updatedCheckedState = stateArray.map((item, idx) => (idx === pos ? !item : item));
    setAllStates({ ...allStates, [section]: updatedCheckedState });
    setIsChanged(true);
  };

  const Content = ({
    checkboxArray,
    section,
  }: {
    checkboxArray: Array<{ label: string; value: string; selected: boolean }>;
    section: string;
  }): JSX.Element => {
    return (
      <div>
        {checkboxArray.map(({ label, value }, index) => {
          return (
            <div key={index}>
              <Checkbox
                label={label}
                value={value}
                id={index.toString()}
                isSelected={allStates[section][index]}
                handleChange={() => changeHandler(index, section)}
                name={label}
                customStyle="mb-4"
              />
            </div>
          );
        })}
      </div>
    );
  };

  // detects if user changes any of the setting options and then enable the Update button
  // useEffect(() => {
  //   // setUpdateButtonDisabled(!updateButtonDisabled);
  //   setIsChanged(!isChanged);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isChanged]);

  // auto-selects all when I want to receive all notification is checked
  useEffect(() => {
    if (selected == true) {
      setAllStates({
        ...allStates,
        socialapp: Array(socialAppCheckboxes.length).fill(true),
        moderationApp: Array(moderationAppCheckboxes.length).fill(true),
        integrationCenter: Array(integrationCenterCheckboxes.length).fill(true),
      });
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
    // save to localstorage so we don't come back again after skipping
    if (window.localStorage) {
      localStorage.setItem('notification-preference', JSON.stringify('1')); // @TODO: where to save settings?
    }

    // navigate to final step
    goToNextStep();
  };

  const confirmHandler = () => {
    // @TODO: save preferences somewhere, now we just save a key in localstorage to mark as set
    try {
      if (window.localStorage) {
        localStorage.setItem('notification-preference', JSON.stringify('1')); // @TODO: where to save settings?
        _uiEvents.current.next({
          event: EventTypes.ShowNotification,
          data: {
            name: 'success',
            message: 'Notification settings updated successfully',
          },
        });

        if (snoozed && !localStorage.getItem('notifications-snoozed')) {
          localStorage.setItem('notifications-snoozed', JSON.stringify(true));

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

        if (!snoozed && localStorage.getItem('notifications-snoozed')) {
          localStorage.removeItem('notifications-snoozed');

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
      }

      // disable the button again after saving preferences
      // setUpdateButtonDisabled(true);
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
        <Text variant="h5" align="center">
          {initial ? t('Customize Your Notifications') : t('Notifications Settings')}
        </Text>
        <Divider customStyle="my-2" />
        <Stack direction="column" customStyle="mx-4">
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
        <Divider customStyle="my-2" />
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
        <Divider customStyle="my-2" />
        <Stack direction="column" customStyle="min-h-[80%]">
          <Accordion
            titleNode={<Title title={t('Antenna')} />}
            contentNode={<Content checkboxArray={socialAppCheckboxes} section={'socialapp'} />}
            open={initial}
            customStyle="mx-4"
            contentStyle="mx-6"
          />
          <Divider customStyle="my-2" />
          <Accordion
            titleNode={<Title title={t('Vibes')} />}
            contentNode={
              <Content checkboxArray={moderationAppCheckboxes} section={'moderationApp'} />
            }
            open={initial}
            customStyle="mx-4"
            contentStyle="mx-6"
          />
          <Divider customStyle="my-2" />
          <Accordion
            titleNode={<Title title={t('Extensions')} />}
            contentNode={
              <Content checkboxArray={integrationCenterCheckboxes} section={'integrationCenter'} />
            }
            open={initial}
            customStyle="mx-4"
            contentStyle="mx-6"
          />
          <Divider customStyle="my-2" />
        </Stack>
        <Stack fullWidth direction="row" justify="end" customStyle="space-x-4 pr-2 pb-2 pt-16">
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
