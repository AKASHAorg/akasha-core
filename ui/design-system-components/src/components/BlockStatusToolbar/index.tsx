import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { ArrowPathIcon, CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Button from '@akashaorg/design-system-core/lib/components/Button';

export interface IBlockStatusToolbar {
  creatingBlockLabel?: string;
  successLabel?: string;
  errorLabel?: string;
  retryLabel?: string;
  blockCreationStatus: 'creating' | 'success' | 'error';
  handleRetry?: () => void;
}

const BlockStatusToolbar: React.FC<IBlockStatusToolbar> = props => {
  const {
    creatingBlockLabel,
    successLabel,
    errorLabel,
    retryLabel,
    blockCreationStatus,
    handleRetry,
  } = props;
  if (blockCreationStatus === 'creating') {
    return (
      <Stack direction="row" spacing="gap-2">
        <Stack
          align="center"
          justify="center"
          customStyle={'h-6 w-6 group relative rounded-full bg(grey9 dark:grey5)'}
        >
          <Icon size="xs" icon={<ArrowPathIcon />} rotateAnimation={true} />
        </Stack>
        <Text>{creatingBlockLabel}</Text>
      </Stack>
    );
  } else if (blockCreationStatus === 'success') {
    return (
      <Stack direction="row" spacing="gap-2">
        <Stack
          align="center"
          justify="center"
          customStyle={'h-6 w-6 group relative rounded-full bg-success/30'}
        >
          <Icon size="xs" icon={<CheckIcon />} color={{ light: 'success', dark: 'success' }} />
        </Stack>
        <Text color={{ light: 'success', dark: 'success' }}>{successLabel}</Text>
      </Stack>
    );
  } else if (blockCreationStatus === 'error') {
    return (
      <Stack direction="row" spacing="gap-2">
        <Stack
          align="center"
          justify="center"
          customStyle={'h-6 w-6 group relative rounded-full bg(errorLight/30 dark:errorDark/30)'}
        >
          <Icon
            size="xs"
            icon={<ExclamationTriangleIcon />}
            color={{ light: 'errorLight', dark: 'errorDark' }}
          />
        </Stack>
        <Text color={{ light: 'errorLight', dark: 'errorDark' }}>{errorLabel}</Text>
        <Button variant="text" onClick={handleRetry} label={retryLabel} />
      </Stack>
    );
  }
};

export default BlockStatusToolbar;
