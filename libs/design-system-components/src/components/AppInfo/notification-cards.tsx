import React from 'react';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { InformationCircleIcon } from '@heroicons/react/24/solid';

export type AppInfoNotificationCardsProps = {
  notification: { title: string; message: string; action?: React.ReactNode };
  version?: string;
  versionLabel?: string;
  updateButtonLabel?: string;
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
      <Card className="p-4">
        <Stack spacing={3} direction="row" alignItems="start" className="w-full">
          <Icon
            icon={<InformationCircleIcon />}
            solid={true}
            size="lg"
            customStyle="[&>*]:fill-errorLight dark:[&>*]:fill-errorLight"
          />
          <Stack spacing={1}>
            <Text variant="button-md">{title}</Text>
            <Text variant="body2">{message}</Text>
            {action}
          </Stack>
        </Stack>
      </Card>
      {updateButtonLabel && (
        <Card className="p-4">
          <Stack direction="row" alignItems="center" justifyContent="between">
            <Text as="span">
              <Button variant="link">{version}</Button>
              {versionLabel}
            </Text>
            <Button>{updateButtonLabel}</Button>
          </Stack>
        </Card>
      )}
    </>
  );
};
