import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import appRoutes, { MY_EXTENSIONS } from '../../../routes';

export const NotConnnected: React.FC = () => {
  const { t } = useTranslation('app-notifications');

  const { baseRouteName, getRoutingPlugin } = useRootComponentProps();

  const navigateTo = getRoutingPlugin().navigateTo;

  const connect = () => {
    navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (routes: Record<string, string>) => {
        return `${routes.Connect}?${new URLSearchParams({
          redirectTo: `${baseRouteName}/${appRoutes[MY_EXTENSIONS]}`,
        }).toString()}`;
      },
    });
  };
  return (
    <Card radius={16} padding={'p-2'} dataTestId="notifications">
      <Stack justify="center" align="center" customStyle="mb-32">
        <Image
          src={'/images/notificationapp-Notconnected-min.webp'}
          customStyle="w-[180px] h-[180px] m-auto my-4"
        />

        <Text variant={'h6'} align="center">
          {t('Uh-oh! You are not connected!')}
        </Text>
        <Text variant="footnotes2" align="center" color={{ light: 'black', dark: 'grey6' }}>
          {t('To check your extensions you must be connected ⚡️')}
        </Text>
      </Stack>
      <Stack direction="row" fullWidth justify="end" spacing="gap-x-4" customStyle="pr-2 pb-2">
        <Button variant="primary" label={t('Connect')} onClick={connect} />
      </Stack>
    </Card>
  );
};
