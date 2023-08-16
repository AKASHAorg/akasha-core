import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Button from '@akashaorg/design-system-core/lib/components/Button';

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
          <Stack align="center" spacing="gap-x-2">
            <Icon
              type="ExclamationTriangleIcon"
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
