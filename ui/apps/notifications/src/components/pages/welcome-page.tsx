import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useRootComponentProps, useGetSettings, useSaveSettings } from '@akashaorg/ui-awf-hooks';
import { NotificationEvents } from '@akashaorg/typings/lib/ui';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import routes, { CUSTOMIZE_NOTIFICATION_OPTIONS_PAGE, SHOW_NOTIFICATIONS_PAGE } from '../../routes';

export type WelcomePageProps = {
  header: string;
  description: string;
  image?: string;
  leftButtonLabel?: string;
  rightButtonLabel: string;
  finalStep?: boolean;
  isLoggedIn: boolean;
};

const WelcomePage: React.FC<WelcomePageProps> = props => {
  const {
    leftButtonLabel,
    rightButtonLabel,
    header,
    description,
    image,
    finalStep = false,
    isLoggedIn,
  } = props;

  const { t } = useTranslation('app-notifications');
  const { baseRouteName, getRoutingPlugin, uiEvents } = useRootComponentProps();

  const navigateTo = getRoutingPlugin().navigateTo;

  const _uiEvents = useRef(uiEvents);

  const Appname = '@akashaorg/app-notifications';

  const fetchSettingsQuery = useGetSettings(Appname);
  const existingSettings = fetchSettingsQuery.data;

  const saveSettingsMutation = useSaveSettings();

  const goToNextStep = () => {
    // navigate to step 2
    return navigateTo?.({
      appName: '@akashaorg/app-notifications',
      getNavigationUrl: () => routes[CUSTOMIZE_NOTIFICATION_OPTIONS_PAGE],
    });
  };

  const goToNotificationsPage = () => {
    return navigateTo?.({
      appName: '@akashaorg/app-notifications',
      getNavigationUrl: () => `${routes[SHOW_NOTIFICATIONS_PAGE]}`,
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
      _uiEvents.current.next({
        event: NotificationEvents.ShowNotification,
        data: {
          name: 'success',
          message: 'Notification settings updated successfully',
        },
      });

      goToNotificationsPage();
    } else {
      goToNextStep();
    }
  };

  const skipCustomization = () => {
    saveSettingsMutation.mutate({ app: Appname, options: { default: true } });

    goToNotificationsPage();
  };

  if (!finalStep && existingSettings) {
    return navigateTo?.({
      appName: '@akashaorg/app-notifications',
      getNavigationUrl: () => routes[SHOW_NOTIFICATIONS_PAGE],
    });
  }

  return (
    <Card elevation={'1'} radius={16} padding={'p-2'} testId="notifications">
      <Stack justify="center" align="center" customStyle="mb-32">
        {image && isLoggedIn ? (
          <Image src={image} customStyle="w-[180px] h-[180px] m-auto my-4" />
        ) : (
          <Card
            customStyle="bg(grey8 dark:grey5) w-[180px] h-[180px] m-auto my-4"
            radius="rounded-xl"
          />
        )}

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
