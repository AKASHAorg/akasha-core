import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import InfoCard from '@akashaorg/design-system-core/lib/components/InfoCard';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import InstallImg from './install-img';
import SuccessImg from './success-img';
import ErrorImg from './error-img';

export type InstallAppProps = {
  title: string;
  appName: string;
  progressInfo: string;
  status: 'in-progress' | 'error' | 'complete';
  action: { label: string; onClick: () => void };
};

const InstallApp: React.FC<InstallAppProps> = ({
  title,
  appName,
  progressInfo,
  status,
  action,
}) => {
  return (
    <Card elevation="1" radius={20} padding={16}>
      <Stack align="center" direction="column" spacing="gap-y-8">
        <Text variant="h5">{title}</Text>
        <InfoCard titleLabel={appName} />
        <Stack align="center" direction="column" customStyle="max-w-xs">
          <>
            {status === 'error' && <ErrorImg />}
            {status === 'in-progress' && <InstallImg />}
            {status === 'complete' && <SuccessImg />}
            <Text
              align="center"
              variant="subtitle1"
              weight="light"
              color={{ light: 'grey4', dark: 'grey6' }}
            >
              {progressInfo}
            </Text>
          </>
          <Button label={action.label} onClick={action.onClick} variant="text" size="lg" />
        </Stack>
      </Stack>
    </Card>
  );
};

export default InstallApp;
