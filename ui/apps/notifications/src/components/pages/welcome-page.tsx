import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useRootComponentProps, useSaveSettings, useGetLogin } from '@akashaorg/ui-awf-hooks';
import { NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import routes, { CUSTOMISE_NOTIFICATION_OPTIONS_PAGE, SHOW_NOTIFICATIONS_PAGE } from '../../routes';

import { useNavigate } from '@tanstack/react-router';

export type WelcomePageProps = {
  finalStep?: boolean;
};

const WelcomePage: React.FC<WelcomePageProps> = props => {
  const { finalStep = false } = props;

  const { data } = useGetLogin();
  const isLoggedIn = !!data?.id;

  const { t } = useTranslation('app-notifications');

  const navigate = useNavigate();

  const header = finalStep ? t('All Done') : t('Welcome to the Notifications App');
  const description = finalStep
    ? t(
        'You will receive notifications based on your choices now! You can always change that or even pause it from the notifications settings!',
      )
    : t(
        `Get the latest updates about what's going on with your world. You can personalize your notifications and get only what you want to see!`,
      );
  const welcomeImage = isLoggedIn
    ? '/images/notificationapp-welcome-min.webp'
    : '/images/notificationapp-Notconnected-min.webp';
  const image = finalStep ? '/images/notificationapp-success-min.webp' : welcomeImage;

  const leftButtonLabel = finalStep ? undefined : t('Skip this step');
  const rightButtonLabel = finalStep
    ? t('Go to my notifications')
    : t('Customize my notifications');

  const { baseRouteName, getRoutingPlugin, uiEvents } = useRootComponentProps();

  const navigateTo = getRoutingPlugin().navigateTo;

  const _uiEvents = useRef(uiEvents);

  const appName = '@akashaorg/app-notifications';

  const { saveNotificationSettings } = useSaveSettings();

  const goToNextStep = () => {
    // navigate to step 2
    navigate({ to: routes[CUSTOMISE_NOTIFICATION_OPTIONS_PAGE] });
  };

  const goToNotificationsPage = () => {
    navigate({ to: routes[SHOW_NOTIFICATIONS_PAGE] });
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
      _uiEvents.current.next({
        event: NotificationEvents.ShowNotification,
        data: {
          type: NotificationTypes.Success,
          message: 'Notification settings updated successfully',
        },
      });

      goToNotificationsPage();
    } else {
      goToNextStep();
    }
  };

  const skipCustomization = () => {
    saveNotificationSettings(
      { app: appName, options: { default: true } },
      { onComplete: () => goToNotificationsPage() },
    );
  };

  return (
    <Card radius={16} padding={'p-2'} testId="notifications">
      <Stack justify="center" align="center" customStyle="mb-32">
        {image && <Image src={image} customStyle="w-[180px] h-[180px] m-auto my-4" />}

        <Text variant={finalStep ? 'h5' : 'h6'} align="center">
          {isLoggedIn ? header : t('Uh-oh! You are not connected!')}
        </Text>
        <Text variant="footnotes2" align="center" color={{ light: 'black', dark: 'grey6' }}>
          {isLoggedIn ? description : t('To check your notifications you must be connected ⚡️')}
        </Text>
      </Stack>
      <Stack direction="row" fullWidth justify="end" spacing="gap-x-4" customStyle="pr-2 pb-2">
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
      </Stack>
    </Card>
  );
};
export default WelcomePage;
