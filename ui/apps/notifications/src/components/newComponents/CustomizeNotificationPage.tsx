import React from 'react';
import { tw } from '@twind/core';
import Accordion from '@akashaorg/design-system-core/lib/components/Accordion';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Checkbox from '@akashaorg/design-system-core/lib/components/Checkbox';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import routes, { CUSTOMIZE_NOTIFICATION_CONFIRMATION_PAGE } from '../../routes';
import { RootComponentProps } from '@akashaorg/typings/ui';
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

const CustomizeNotificationPage: React.FC<RootComponentProps> = props => {
  const { plugins } = props;

  const [selected, setSelected] = React.useState(false);
  const [allStates, setAllStates] = React.useState({
    social: Array.from(socialAppCheckboxes.map(e => e.selected)),
    articleApp: Array.from(articleAppCheckboxes.map(e => e.selected)),
    moderationApp: Array(moderationAppCheckboxes.map(e => e.selected)),
    integrationCenter: Array(integrationCenterCheckboxes.map(e => e.selected)),
  });

  const navigateTo = plugins['@akashaorg/app-routing']?.routing.navigateTo;

  const { t } = useTranslation('app-notifications');

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

  const Title = (title: string): JSX.Element => (
    <div className={tw('flex flex-row items-center')}>
      <Text variant="h6" align="center">
        {title}
      </Text>
    </div>
  );

  const Content = (
    checkboxArray: { label: string; selected: boolean }[],
    section: string,
  ): JSX.Element => {
    return (
      <div>
        {checkboxArray.map(({ label }, index) => (
          <div className={tw('')} key={index}>
            <Checkbox
              label={t(label)}
              value={label}
              id={index.toString()}
              isSelected={allStates[section][index]}
              handleChange={() => changeHandler(index, section)}
              name={label}
              customStyle="mb-4"
            />
          </div>
        ))}
      </div>
    );
  };

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

  const goToNextStep = () => {
    // navigate to final step
    return navigateTo?.({
      appName: '@akashaorg/app-notifications',
      getNavigationUrl: () => routes[CUSTOMIZE_NOTIFICATION_CONFIRMATION_PAGE],
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
    }

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
        Customize Your Notifications
      </Text>
      <Text variant="footnotes2" color={{ dark: 'grey6', light: 'grey4' }}>
        Choose the notifications that you would like to receive from other applications. Remember,
        you can change this anytime from the notifications settings.
      </Text>
      <Checkbox
        id="receive-all-notifications-checkbox"
        label="I want to receive all types of notifications"
        value="I want to receive all types of notifications"
        name="check-all"
        isSelected={selected}
        handleChange={() => setSelected(!selected)}
        customStyle="ml-2"
      />
      <Divider customStyle="my-2" />
      <div className={tw('min-h-[80%]')}>
        <Accordion
          titleNode={Title('Social App')}
          contentNode={Content(socialAppCheckboxes, 'social')}
          open={true}
        />
        <Divider customStyle="my-2" />
        <Accordion
          titleNode={Title('Article App')}
          contentNode={Content(articleAppCheckboxes, 'articleApp')}
          open={true}
        />
        <Divider customStyle="my-2" />
        <Accordion
          titleNode={Title('Moderation App')}
          contentNode={Content(moderationAppCheckboxes, 'moderationApp')}
          open={true}
        />
        <Divider customStyle="my-2" />
        <Accordion
          titleNode={Title('Integration Center')}
          contentNode={Content(integrationCenterCheckboxes, 'integrationCenter')}
          open={true}
        />
      </div>
      <div className={tw('w-full flex justify-end space-x-4 pr-2 pb-2')}>
        <Button
          variant="text"
          label="Do it later"
          color="secondaryLight dark:secondaryDark"
          onClick={skipHandler}
        />
        <Button variant="primary" label="Confirm" onClick={confirmHandler} />
      </div>
    </Card>
  );
};
export default CustomizeNotificationPage;
