import React from 'react';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { InfoIcon } from 'lucide-react';

export type AppInfoNotificationCardsProps = {
  notification: {
    title: string;
    message: string;
    action?: React.ReactNode;
  };
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
          <InfoIcon className="h-6 w-6 [&>*]:fill-errorLight dark:[&>*]:fill-errorLight" />
          <Stack spacing={1}>
            <Typography variant="sm" bold>
              {title}
            </Typography>
            <Typography variant="sm">{message}</Typography>
            {action}
          </Stack>
        </Stack>
      </Card>
      {updateButtonLabel && (
        <Card className="p-4">
          <Stack direction="row" alignItems="center" justifyContent="between">
            <Typography>
              <Button variant="link">{version}</Button>
              {versionLabel}
            </Typography>
            <Button>{updateButtonLabel}</Button>
          </Stack>
        </Card>
      )}
    </>
  );
};
