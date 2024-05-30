import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { InformationCircleIcon } from '@heroicons/react/24/solid';

export type AppInfoNotificationCardsProps = {
  notification: { title: string; message: string; action: React.ReactNode };
  version: string;
  versionLabel: string;
  updateButtonLabel: string;
};

export const AppInfoNotificationCards: React.FC<AppInfoNotificationCardsProps> = props => {
  const {
    notification: { title, message, action },
    version,
    versionLabel,
    updateButtonLabel,
  } = props;
  return (
    <>
      <Card radius={8} background={{ light: 'grey9', dark: 'grey3' }} padding="p-4">
        <Stack spacing="gap-x-3" fullWidth direction="row" align="start">
          <Icon
            icon={<InformationCircleIcon />}
            solid={true}
            size="lg"
            color={{ light: 'errorLight', dark: 'errorDark' }}
          />
          <Stack spacing="gap-y-1">
            <Text variant="button-md">{title}</Text>
            <Text variant="body2">{message}</Text>
            {action}
          </Stack>
        </Stack>
      </Card>
      <Card radius={8} background={{ light: 'grey9', dark: 'grey3' }} customStyle="p-4">
        <Stack direction="row" justify="between" align="center">
          <Text variant="button-md">
            <Text
              as="span"
              variant="button-md"
              color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
            >
              {version}
            </Text>{' '}
            {versionLabel}
          </Text>
          <Button variant="primary" label={updateButtonLabel} />
        </Stack>
      </Card>
    </>
  );
};
