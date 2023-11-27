import React from 'react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ExclamationTriangleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type ConnectErrorCardProps = {
  title: string;
  message: string;
  action?: { onClick: () => void; label: string };
};

const ConnectErrorCard: React.FC<ConnectErrorCardProps> = ({ title, message, action }) => {
  return (
    <Card
      elevation="none"
      background={{ light: 'grey9', dark: 'grey5' }}
      radius={20}
      padding={'p-4'}
    >
      <Stack direction="column" spacing="gap-y-2">
        <Stack justify="between">
          <Stack direction="row" align="center" spacing="gap-x-2">
            <Icon
              icon={<ExclamationTriangleIcon />}
              color={{ light: 'errorLight', dark: 'errorDark' }}
            />
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
          <Button
            variant="primary"
            label={action.label}
            onClick={action.onClick}
            customStyle="ml-auto"
          />
        )}
      </Stack>
    </Card>
  );
};

export default ConnectErrorCard;
