import React from 'react';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { TriangleAlertIcon } from 'lucide-react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export type ConnectErrorCardProps = {
  title: string;
  message: string;
  action?: {
    onClick: () => void;
    label: string;
  };
};
/**
 * Component used to display an error message in the auth app
 * @param title - title of the error
 * @param message - message of the error
 * @param action - generic handler
 */
const ConnectErrorCard: React.FC<ConnectErrorCardProps> = ({ title, message, action }) => {
  return (
    <Card className="p-4">
      <Stack direction="column" spacing={2}>
        <Stack justifyContent="between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <TriangleAlertIcon className="h-5 w-5[&>*]:stroke-errorLight dark:[&>*]:stroke-errorDark" />
            <Typography variant="sm" bold className="grow text-errorLight dark:text-errorDark">
              {title}
            </Typography>
          </Stack>
        </Stack>
        <Typography variant="sm" className="font-normal">
          {message}
        </Typography>
        {action && (
          <Button onClick={action.onClick} className="ml-auto">
            {action.label}
          </Button>
        )}
      </Stack>
    </Card>
  );
};
export default ConnectErrorCard;
