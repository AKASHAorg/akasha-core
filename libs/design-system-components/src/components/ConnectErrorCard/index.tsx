import React from 'react';

import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { TriangleAlertIcon } from 'lucide-react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type ConnectErrorCardProps = {
  title: string;
  message: string;
  action?: { onClick: () => void; label: string };
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
            <Text
              variant="button-md"
              customStyle="grow"
              color={{ light: 'errorLight', dark: 'errorDark' }}
            >
              {title}
            </Text>
          </Stack>
        </Stack>
        <Text variant="body2" weight="normal">
          {message}
        </Text>
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
