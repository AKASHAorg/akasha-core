import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import InfoCard from '@akashaorg/design-system-core/lib/components/InfoCard';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ErrorIcon from './error-icon';
import InstallIcon from './install-icon';
import SuccessIcon from './success-icon';
import { getColorClasses } from '@akashaorg/design-system-core/lib/utils/getColorClasses';
import { apply, tw } from '@twind/core';

export type InstallAppProps = {
  title: string;
  appName: string;
  progressInfo: string;
  status: 'in-progress' | 'error' | 'complete';
  action: { label: string; onClick: () => void };
};

const errorStyle = getColorClasses({ light: 'warningLight', dark: 'warningDark' }, '[&>*]:fill');
const errorAnimationStyle = `animate-ping absolute h-full w-full ${errorStyle} opacity-75`;

const installStyle = `animate-bounce ${getColorClasses(
  { light: 'secondaryLight', dark: 'secondaryDark' },
  '[&>*]:fill',
)}`;

const successStyle = getColorClasses('success', '[&>*]:fill');
const successAnimationStyle = `animate-ping absolute h-full w-full ${successStyle} opacity-75`;

const InstallApp: React.FC<InstallAppProps> = ({
  title,
  appName,
  progressInfo,
  status,
  action,
}) => {
  return (
    <Card elevation="1" radius={20} padding={'p-4'}>
      <Stack align="center" direction="column" spacing="gap-y-8">
        <Text variant="h5">{title}</Text>
        <InfoCard titleLabel={appName} />
        <Stack direction="column" customStyle="max-w-xs">
          <Stack align="center" direction="column" spacing="gap-y-2">
            {status === 'error' && (
              <div className={tw('relative')}>
                <ErrorIcon className={tw(apply`${errorAnimationStyle}`)} />
                <ErrorIcon className={tw(apply`${errorStyle}`)} />
              </div>
            )}
            {status === 'in-progress' && <InstallIcon className={installStyle} />}
            {status === 'complete' && (
              <div className={tw('relative')}>
                <SuccessIcon className={tw(apply`${successAnimationStyle}`)} />
                <SuccessIcon className={tw(apply`${successStyle}`)} />
              </div>
            )}
            <Text
              align="center"
              variant="subtitle1"
              weight="light"
              color={{ light: 'grey4', dark: 'grey6' }}
            >
              {progressInfo}
            </Text>
          </Stack>
          <Button label={action.label} onClick={action.onClick} variant="text" size="lg" />
        </Stack>
      </Stack>
    </Card>
  );
};

export default InstallApp;
