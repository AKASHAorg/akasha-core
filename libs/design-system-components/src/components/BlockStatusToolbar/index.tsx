import React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { ArrowPathIcon, CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';

export enum BlockCreationStatus {
  PENDING,
  ERROR,
  SUCCESS,
}

export interface IBlockStatusToolbar {
  creatingBlockLabel?: string;
  successLabel?: string;
  errorLabel?: string;
  retryLabel?: string;
  blockCreationStatus: BlockCreationStatus;
  handleRetry?: () => void;
}

/**
 * Component used to display the block creation status for each block in the beam editor
 * Used as part of the BlockHeader component
 * @param blockCreationStatus - status displayed for each block after the action of publishing
 * a beam is triggered
 * @param creatingBlockLabel - label for the pending state of block creation
 * @param successLabel - label for the success state of block creation
 * @param errorLabel - label for the error state of block creation
 * @param retryLabel- label for the retry action
 * @param handleRetry- handler to retry publishing the block in case of an error state
 */
const BlockStatusToolbar: React.FC<IBlockStatusToolbar> = props => {
  const {
    creatingBlockLabel,
    successLabel,
    errorLabel,
    retryLabel,
    blockCreationStatus,
    handleRetry,
  } = props;

  if (blockCreationStatus === BlockCreationStatus.PENDING) {
    return (
      <Stack direction="row" alignItems="center" spacing={2}>
        <Stack
          alignItems="center"
          justifyContent="center"
          className="h-8 w-8 group relative rounded-full bg-grey9 dark:bg-grey5"
        >
          <Icon size="sm" icon={<ArrowPathIcon />} rotateAnimation={true} />
        </Stack>
        <Text>{creatingBlockLabel}</Text>
      </Stack>
    );
  } else if (blockCreationStatus === BlockCreationStatus.SUCCESS) {
    return (
      <Stack direction="row" alignItems="center" spacing={2}>
        <Stack
          alignItems="center"
          justifyContent="center"
          className="h-8 w-8 group relative rounded-full bg-success/30"
        >
          <Icon size="sm" icon={<CheckIcon />} customStyle={'[&>*]:stroke-stroke'} />
        </Stack>
        <Text color={{ light: 'success', dark: 'success' }}>{successLabel}</Text>
      </Stack>
    );
  } else if (blockCreationStatus === BlockCreationStatus.ERROR) {
    return (
      <Stack direction="row" alignItems="center" spacing={2}>
        <Stack
          alignItems="center"
          justifyContent="center"
          className="h-8 w-8 group relative rounded-full bg-errorLight/30 dark:bg-errorDark/30"
        >
          <Icon
            size="sm"
            icon={<ExclamationTriangleIcon />}
            customStyle={'[&>*]:stroke-errorLight dark:[&>*]:stroke-errorDark'}
          />
        </Stack>
        <Text color={{ light: 'errorLight', dark: 'errorDark' }}>{errorLabel}</Text>
        {!!handleRetry && (
          <Button variant="link" onClick={handleRetry}>
            {retryLabel}
          </Button>
        )}
      </Stack>
    );
  }
};

export default BlockStatusToolbar;
