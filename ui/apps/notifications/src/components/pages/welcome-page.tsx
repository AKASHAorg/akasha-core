import React from 'react';
import { tw } from '@twind/core';
import { useTranslation } from 'react-i18next';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import routes, {
  CUSTOMIZE_NOTIFICATION_OPTIONS_PAGE,
  SHOW_NOTIFICATIONS_PAGE,
  CUSTOMIZE_NOTIFICATION_WELCOME_PAGE,
} from '../../routes';
import { RootComponentProps } from '@akashaorg/typings/ui';

type WelcomePageProps = {
  header: string;
  description: string;
  leftButtonLabel?: string;
  // leftButtonClickHandler?: () => void;
  rightButtonLabel: string;
  // rightButtonClickHandler?: () => void;
  finalStep?: boolean;
  isLoggedIn: boolean;
};

const WelcomePage: React.FC<RootComponentProps & WelcomePageProps> = props => {
  const {
    baseRouteName,
    plugins,
    leftButtonLabel,
    // leftButtonClickHandler,
    rightButtonLabel,
    // rightButtonClickHandler,
    header,
    description,
    finalStep = false,
    isLoggedIn,
  } = props;

  const navigateTo = plugins['@akashaorg/app-routing']?.routing.navigateTo;
  const { t } = useTranslation('app-notifications');

  // check if user has gone through onboarding steps before
  let savedPreferences;
  if (window.localStorage) {
    savedPreferences = JSON.parse(localStorage.getItem('notification-preference'));
  }

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

  const connect = () => {
    navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (routes: Record<string, string>) => {
        return `${routes.Connect}?${new URLSearchParams({
          redirectTo: `${baseRouteName}`,
        }).toString()}`;
      },
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

  if (isLoggedIn && savedPreferences) {
    return navigateTo?.({
      appName: '@akashaorg/app-notifications',
      getNavigationUrl: () => routes[SHOW_NOTIFICATIONS_PAGE],
    });
  }

  return (
    <Card direction="row" elevation={'1'} radius={16} padding={8} testId="notifications">
      <div className={tw('flex(& col) justify-center align-center mb-32')}>
        <BasicCardBox
          customStyle="bg(grey8 dark:grey5) w-[180px] h-[180px] m-auto my-4"
          round="rounded-xl"
        />
        <Text variant={finalStep ? 'h5' : 'h6'} align="center">
          {isLoggedIn ? header : t('Uh-oh! You are not connected!')}
        </Text>
        <Text variant="footnotes2" align="center" color={{ light: 'black', dark: 'grey6' }}>
          {isLoggedIn ? description : t('To check your notifications you must be connected ⚡️')}
        </Text>
      </div>
      <div className={tw('w-full flex justify-end space-x-4 pr-2 pb-2')}>
        {isLoggedIn && leftButtonLabel && (
          <Button
            variant="text"
            label={leftButtonLabel}
            color="secondaryLight dark:secondaryDark"
            onClick={skipCustomization}
          />
        )}
        <Button
          variant="primary"
          label={isLoggedIn ? rightButtonLabel : t('Connect')}
          onClick={isLoggedIn ? confirmCustomization : connect}
        />
      </div>
    </Card>
  );
};
export default WelcomePage;
