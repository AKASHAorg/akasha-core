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
  blockCreationStatus: 'pending' | 'success' | 'error';
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

  if (blockCreationStatus === 'pending') {
    return (
      <Stack direction="row" align="center" spacing="gap-2">
        <Stack
          align="center"
          justify="center"
          customStyle={'h-8 w-8 group relative rounded-full bg(grey9 dark:grey5)'}
        >
          <Icon size="sm" icon={<ArrowPathIcon />} rotateAnimation={true} />
        </Stack>
        <Text>{creatingBlockLabel}</Text>
      </Stack>
    );
  } else if (blockCreationStatus === 'success') {
    return (
      <Stack direction="row" align="center" spacing="gap-2">
        <Stack
          align="center"
          justify="center"
          customStyle={'h-8 w-8 group relative rounded-full bg-success/30'}
        >
          <Icon size="sm" icon={<CheckIcon />} color={{ light: 'success', dark: 'success' }} />
        </Stack>
        <Text color={{ light: 'success', dark: 'success' }}>{successLabel}</Text>
      </Stack>
    );
  } else if (blockCreationStatus === 'error') {
    return (
      <Stack direction="row" align="center" spacing="gap-2">
        <Stack
          align="center"
          justify="center"
          customStyle={'h-8 w-8 group relative rounded-full bg(errorLight/30 dark:errorDark/30)'}
        >
          <Icon
            size="sm"
            icon={<ExclamationTriangleIcon />}
            color={{ light: 'errorLight', dark: 'errorDark' }}
          />
        </Stack>
        <Text color={{ light: 'errorLight', dark: 'errorDark' }}>{errorLabel}</Text>
        {!!handleRetry && <Button variant="text" onClick={handleRetry} label={retryLabel} />}
      </Stack>
    );
  }
};

export default BlockStatusToolbar;
