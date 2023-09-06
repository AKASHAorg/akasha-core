import React, { useEffect, useMemo, useRef, useState } from 'react';
import { tw } from '@twind/core';
import { useTranslation } from 'react-i18next';

import { EventTypes } from '@akashaorg/typings/ui';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

import Accordion from '@akashaorg/design-system-core/lib/components/Accordion';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Checkbox from '@akashaorg/design-system-core/lib/components/Checkbox';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Snackbar, { SnackBarType } from '@akashaorg/design-system-core/lib/components/Snackbar';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Toggle from '@akashaorg/design-system-core/lib/components/Toggle';

import routes, {
  CUSTOMIZE_NOTIFICATION_WELCOME_PAGE,
  CUSTOMIZE_NOTIFICATION_CONFIRMATION_PAGE,
  SHOW_NOTIFICATIONS_PAGE,
} from '../../routes';

type CustomizeNotificationPageProps = {
  initial?: boolean;
  isLoggedIn: boolean;
};

const Title = ({ title }: { title: string }): JSX.Element => {
  return (
    <div className={tw('flex flex-row items-center')}>
      <Text variant="h6" align="center">
        {title}
      </Text>
    </div>
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
        label: t('Replies to my post'),
        value: 'Replies to my post',
        selected: true,
      },
      {
        label: t('Mentions me in a post / reply'),
        value: 'Mentions me in a post / reply',
        selected: true,
      },
      {
        label: t('Someone sharing my post'),
        value: 'Someone sharing my post',
        selected: true,
      },
      {
        label: t('When someone I am following posts new content'),
        value: 'When someone I am following posts new content',
        selected: true,
      },
      {
        label: t('When there’s new content in topics I’m Subscribed to'),
        value: 'When there’s new content in topics I’m Subscribed to',
        selected: true,
      },
    ],
    [t],
  );

  const articleAppCheckboxes = useMemo(
    () => [
      {
        label: t('Replies to my Article'),
        value: 'Replies to my Article',
        selected: true,
      },
      {
        label: t('Quotes me in an Article.'),
        value: 'Quotes me in an Article',
        selected: true,
      },
      {
        label: t('Someone shares my Article'),
        value: 'Someone shares my Article',
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
    articleApp: articleAppCheckboxes.map(e => e.selected),
    moderationApp: moderationAppCheckboxes.map(e => e.selected),
    integrationCenter: integrationCenterCheckboxes.map(e => e.selected),
  });

  // for displaying feedback messages
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const [showFeedback, setShowFeedback] = useState(false);

  if (showFeedback) {
    setTimeout(() => {
      setShowFeedback(false);
      setMessage('');
    }, 6000);
  }

  const [snoozed, setSnoozed] = useState(false);

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
        case 'articleApp':
          return allStates.articleApp;
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
            <div className={tw('')} key={index}>
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
        articleApp: Array(articleAppCheckboxes.length).fill(true),
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
          : `${routes[SHOW_NOTIFICATIONS_PAGE]}/?message=${message}&type=success`,
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
        setMessage('Notification settings updated successfully');

        if (snoozed && !localStorage.getItem('notifications-snoozed')) {
          localStorage.setItem('notifications-snoozed', JSON.stringify(true));

          // emit snooze notification event so the topbar's notification icon can be updated
          _uiEvents.current.next({
            event: EventTypes.SnoozeNotifications,
          });
          setMessage('You have snoozed your notifications successfully');
        }

        if (!snoozed && localStorage.getItem('notifications-snoozed')) {
          localStorage.removeItem('notifications-snoozed');

          // emit unsnooze notification event so the topbar's notification icon can be updated
          _uiEvents.current.next({
            event: EventTypes.UnsnoozeNotifications,
          });
          setMessage('You have unsnoozed your notifications successfully');
        }
      }

      // disable the button again after saving preferences
      // setUpdateButtonDisabled(true);
      setIsChanged(false);

      // navigate to final step
      initial && goToNextStep();
    } catch (error) {
      setMessage('Something went wrong. Retry');
      setMessageType('error');
    }
    setShowFeedback(true);
  };

  if (!isLoggedIn) {
    return navigateTo?.({
      appName: '@akashaorg/app-notifications',
      getNavigationUrl: () => routes[CUSTOMIZE_NOTIFICATION_WELCOME_PAGE],
    });
  }

  return (
    <>
      <Card elevation={'1'} radius={16} padding={'p-2'} customStyle="h-full md:h-min space-y-4">
        <Text variant="h5" align="center">
          {initial ? t('Customize Your Notifications') : t('Notifications Settings')}
        </Text>
        {!initial && (
          <>
            <Divider customStyle="my-2" />
            <Box customStyle="flex justify-between">
              <Text variant="footnotes2">
                <>{t('Snooze Notifications')}</>
              </Text>
              <Toggle
                iconChecked="BellSnoozeIcon"
                iconUnchecked="BellAlertIcon"
                checked={snoozed}
                onChange={snoozeChangeHandler}
              />
            </Box>
            <Divider customStyle="my-2" />
          </>
        )}
        {initial ? (
          <Text variant="footnotes2" color={{ dark: 'grey6', light: 'grey4' }}>
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
          customStyle="ml-2"
        />
        <Divider customStyle="my-2" />
        <div className={tw('min-h-[80%]')}>
          <Accordion
            titleNode={<Title title={t('Social App')} />}
            contentNode={<Content checkboxArray={socialAppCheckboxes} section={'socialapp'} />}
            open={initial}
          />
          <Divider customStyle="my-2" />
          <Accordion
            titleNode={<Title title={t('Article App')} />}
            contentNode={<Content checkboxArray={articleAppCheckboxes} section={'articleApp'} />}
            open={initial}
          />
          <Divider customStyle="my-2" />
          <Accordion
            titleNode={<Title title={t('Vibe App')} />}
            contentNode={
              <Content checkboxArray={moderationAppCheckboxes} section={'moderationApp'} />
            }
            open={initial}
          />
          <Divider customStyle="my-2" />
          <Accordion
            titleNode={<Title title={t('AKASHAVerse')} />}
            contentNode={
              <Content checkboxArray={integrationCenterCheckboxes} section={'integrationCenter'} />
            }
            open={initial}
          />
        </div>
        <div className={tw('w-full flex justify-end space-x-4 pr-2 pb-2')}>
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
        </div>
      </Card>
      {showFeedback && (
        <div className={tw('-mt-12 md:mt-4 z-50 w-full')}>
          <Snackbar
            title={message}
            type={messageType as SnackBarType}
            handleDismiss={() => setShowFeedback(false)}
          />
        </div>
      )}
    </>
  );
};
export default CustomizeNotificationPage;
