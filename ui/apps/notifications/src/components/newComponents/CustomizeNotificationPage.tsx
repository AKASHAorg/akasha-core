import React from 'react';
import { tw } from '@twind/core';
import Accordion from '@akashaorg/design-system-core/lib/components/Accordion';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Checkbox from '@akashaorg/design-system-core/lib/components/Checkbox';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Toggle from '@akashaorg/design-system-core/lib/components/Toggle';
import routes, {
  CUSTOMIZE_NOTIFICATION_CONFIRMATION_PAGE,
  SHOW_NOTIFICATIONS_PAGE,
} from '../../routes';
import { RootComponentProps, EventTypes } from '@akashaorg/typings/ui';
import { useTranslation } from 'react-i18next';

const socialAppCheckboxes: { label: string; selected: boolean }[] = [
  { label: 'New Followers', selected: true },
  { label: 'Replies to my post', selected: true },
  { label: 'Mentions me in a post / reply', selected: true },
  { label: 'Someone sharing my post', selected: true },
  { label: 'When someone I am following posts new content', selected: true },
  {
    label: 'When there’s new content in topics I’m Subscribed to',
    selected: true,
  },
];
const articleAppCheckboxes: { label: string; selected: boolean }[] = [
  { label: 'Replies to my Article', selected: true },
  { label: 'Quotes me in an Article.', selected: true },
  { label: 'Someone shares my Article', selected: true },
];
const moderationAppCheckboxes: { label: string; selected: boolean }[] = [
  { label: 'My content gets delisted/kept', selected: true },
];
const integrationCenterCheckboxes: { label: string; selected: boolean }[] = [
  { label: 'New versions of installed integrations', selected: true },
];

interface ICustomizeNotificationPageProps extends RootComponentProps {
  initial?: boolean;
}

const CustomizeNotificationPage: React.FC<ICustomizeNotificationPageProps> = ({
  initial = true,
  ...props
}) => {
  const { plugins } = props;

  const [selected, setSelected] = React.useState(true);
  const [allStates, setAllStates] = React.useState({
    social: Array.from(socialAppCheckboxes.map(e => e.selected)),
    articleApp: Array.from(articleAppCheckboxes.map(e => e.selected)),
    moderationApp: Array(moderationAppCheckboxes.map(e => e.selected)),
    integrationCenter: Array(integrationCenterCheckboxes.map(e => e.selected)),
  });

  const [snoozed, setSnoozed] = React.useState(false);

  // check if snooze notification option has already been set
  React.useEffect(() => {
    if (window.localStorage) {
      setSnoozed(JSON.parse(localStorage.getItem('notifications-snoozed')));
    }
  }, []);

  //for the button, disabled when no change made, enabled when there's an change
  const [updateButtonDisabled, setUpdateButtonDisabled] = React.useState(true);

  const snoozeChangeHandler = e => {
    setSnoozed(!snoozed);
  };

  const navigateTo = plugins['@akashaorg/app-routing']?.routing.navigateTo;

  const { t } = useTranslation('app-notifications');

  // added for emitting snooze notification event
  const uiEvents = React.useRef(props.uiEvents);

  const changeHandler = (pos: number, section: string): void => {
    const stateArray = (() => {
      switch (section) {
        case 'social':
          return allStates.social;
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
  };

  const Title = (title: string): JSX.Element => {
    const translatedTitle = t(title);
    return (
      <div className={tw('flex flex-row items-center')}>
        <Text variant="h6" align="center">
          {translatedTitle}
        </Text>
      </div>
    );
  };

  const Content = (
    checkboxArray: { label: string; selected: boolean }[],
    section: string,
  ): JSX.Element => {
    return (
      <div>
        {checkboxArray.map(({ label }, index) => {
          const translatedLabel = t(label);

          return (
            <div className={tw('')} key={index}>
              <Checkbox
                label={translatedLabel}
                value={label}
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
  React.useEffect(() => {
    setUpdateButtonDisabled(!updateButtonDisabled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, allStates, snoozed]);

  // auto-selects all when I want to receive all notification is checked
  React.useEffect(() => {
    if (selected == true) {
      setAllStates({
        ...allStates,
        social: Array(socialAppCheckboxes.length).fill(true),
        articleApp: Array(articleAppCheckboxes.length).fill(true),
        moderationApp: Array(moderationAppCheckboxes.length).fill(true),
        integrationCenter: Array(integrationCenterCheckboxes.length).fill(true),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  let message = '';

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
    // navigate to final step
    goToNextStep();
  };

  const confirmHandler = () => {
    // @TODO: save preferences somewhere, now we just save a key in localstorage to mark as set
    if (window.localStorage) {
      localStorage.setItem('notification-preference', JSON.stringify('1'));
      if (snoozed && !localStorage.getItem('notifications-snoozed')) {
        localStorage.setItem('notifications-snoozed', JSON.stringify(true));

        // emit snooze notification event so the topbar's notification icon can be updated
        uiEvents.current.next({
          event: EventTypes.SnoozeNotifications,
        });
      }
      if (!snoozed && localStorage.getItem('notifications-snoozed')) {
        localStorage.removeItem('notifications-snoozed');

        // emit unsnooze notification event so the topbar's notification icon can be updated
        uiEvents.current.next({
          event: EventTypes.UnsnoozeNotifications,
        });
      }
    }

    message = 'Notification settings updated successfully';
    // navigate to final step
    goToNextStep();
  };

  return (
    <Card
      direction="row"
      elevation={'1'}
      radius={16}
      padding={{ x: 8, y: 8 }}
      customStyle="h-full md:h-min space-y-4"
    >
      <Text variant="h5" align="center">
        {initial ? ' Customize Your Notifications' : 'Notifications Settings'}
      </Text>
      {!initial && (
        <>
          <Divider customStyle="my-2" />
          <Box customStyle="flex justify-between">
            <Text variant="footnotes2">Snooze Notifications</Text>
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
          Choose the notifications that you would like to receive from other applications. Remember,
          you can change this anytime from the notifications settings.
        </Text>
      ) : (
        <Text variant="h6">Receiving Notifications</Text>
      )}
      <Checkbox
        id="receive-all-notifications-checkbox"
        label={t('I want to receive all types of notifications')}
        value="I want to receive all types of notifications"
        name="check-all"
        isSelected={selected}
        handleChange={() => setSelected(!selected)}
        customStyle="ml-2"
      />
      <Divider customStyle="my-2" />
      <div className={tw('min-h-[80%]')}>
        <Accordion
          titleNode={Title(t('Social App'))}
          contentNode={Content(socialAppCheckboxes, 'social')}
          open={initial}
        />
        <Divider customStyle="my-2" />
        <Accordion
          titleNode={Title(t('Article App'))}
          contentNode={Content(articleAppCheckboxes, 'articleApp')}
          open={initial}
        />
        <Divider customStyle="my-2" />
        <Accordion
          titleNode={Title(t('Moderation App'))}
          contentNode={Content(moderationAppCheckboxes, 'moderationApp')}
          open={initial}
        />
        <Divider customStyle="my-2" />
        <Accordion
          titleNode={Title(t('Integration Center'))}
          contentNode={Content(integrationCenterCheckboxes, 'integrationCenter')}
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
              disabled={updateButtonDisabled}
            />
          </>
        )}
      </div>
    </Card>
  );
};
export default CustomizeNotificationPage;
