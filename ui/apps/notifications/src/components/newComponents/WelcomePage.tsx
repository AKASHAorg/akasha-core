import React from 'react';
import { tw } from '@twind/core';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import routes, { CUSTOMIZE_NOTIFICATION_OPTIONS_PAGE, SHOW_NOTIFICATIONS_PAGE } from '../../routes';
import { RootComponentProps } from '@akashaorg/typings/ui';

interface IWelcomePageProps {
  header: string;
  description: string;
  leftButtonLabel?: string;
  // leftButtonClickHandler?: () => void;
  rightButtonLabel: string;
  // rightButtonClickHandler?: () => void;
  finalStep?: boolean;
}

const WelcomePage: React.FC<RootComponentProps & IWelcomePageProps> = props => {
  const {
    plugins,
    leftButtonLabel,
    // leftButtonClickHandler,
    rightButtonLabel,
    // rightButtonClickHandler,
    header,
    description,
    finalStep = false,
  } = props;

  const navigateTo = plugins['@akashaorg/app-routing']?.routing.navigateTo;
  let message = '';

  const goToNextStep = () => {
    // navigate to step 2
    return navigateTo?.({
      appName: '@akashaorg/app-notifications',
      getNavigationUrl: () => routes[CUSTOMIZE_NOTIFICATION_OPTIONS_PAGE],
    });
  };

  const goToNotificationsPage = () => {
    // go to notifications page
    return navigateTo?.({
      appName: '@akashaorg/app-notifications',
      getNavigationUrl: () => `${routes[SHOW_NOTIFICATIONS_PAGE]}?message=${message}&type=success`,
    });
  };

  const confirmCustomization = () => {
    if (finalStep) {
      message = 'Notification settings updated successfully';

      goToNotificationsPage();
    } else {
      goToNextStep();
    }
  };

  const skipCustomization = () => {
    if (window.localStorage) {
      localStorage.setItem('notification-preference', JSON.stringify('1')); // @TODO: where to save settings?
    }
    message = '';
    // navigate to notifications
    goToNotificationsPage();
  };

  return (
    <Card direction="row" elevation={'1'} radius={16} padding={8} data-testid="notifications">
      <div className={tw('flex(& col) justify-center align-center mb-32')}>
        <BasicCardBox
          customStyle="bg(grey8 dark:grey5) w-[180px] h-[180px] m-auto my-4"
          round="rounded-xl"
        />
        <Text variant={finalStep ? 'h5' : 'h6'} align="center">
          {header}
        </Text>
        <Text variant="footnotes2" align="center" color={{ light: 'black', dark: 'grey6' }}>
          {description}
        </Text>
      </div>
      <div className={tw('w-full flex justify-end space-x-4 pr-2 pb-2')}>
        {leftButtonLabel && (
          <Button
            variant="text"
            label={leftButtonLabel}
            color="secondaryLight dark:secondaryDark"
            onClick={skipCustomization}
          />
        )}
        <Button variant="primary" label={rightButtonLabel} onClick={confirmCustomization} />
      </div>
    </Card>
  );
};
export default WelcomePage;
