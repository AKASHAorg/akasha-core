import React, { useMemo } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import {
  CheckIcon,
  ExclamationTriangleIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

export type TIndicatorDotsProps = {
  isSuccess?: boolean;
  hasErrors?: boolean;
  size?: 'sm' | 'md';
};

const getDotColor = (success: boolean, error: boolean) => {
  if (success) {
    return 'bg(success dark:success)';
  }

  if (error) {
    return 'bg(errorLight dark:errorDark)';
  }

  return 'bg(secondaryLight dark:secondaryDark)';
};

/**
 * Component used in the auth app to showcase the status of wallet connection
 * @param isSuccess - state of the wallet connection process
 * @param hasErrors - error state
 */
const IndicatorDots: React.FC<TIndicatorDotsProps> = props => {
  const { isSuccess, hasErrors = false, size = 'md' } = props;
  const dotSizes = useMemo(() => {
    if (size === 'md') {
      return {
        first: '4',
        middle: '5',
        last: '4',
      };
    }
    if (size === 'sm') {
      return {
        first: '2',
        middle: '3',
        last: '2',
      };
    }
  }, [size]);

  const dotColor = React.useMemo(() => getDotColor(isSuccess, hasErrors), [isSuccess, hasErrors]);

  return (
    <Stack direction="row" align="center" justify="center" customStyle="mx-4">
      <Stack
        customStyle={`rounded-full w-${dotSizes.first} h-${dotSizes.first} ${dotColor} opacity-50`}
      />
      <Stack
        direction="row"
        align="center"
        justify="center"
        customStyle={`rounded-full w-${dotSizes.middle} h-${dotSizes.middle} ${dotColor} mx-2`}
      >
        {isSuccess && <Icon icon={<CheckIcon />} color="white" size="xs" />}
        {hasErrors && <Icon icon={<ExclamationTriangleIcon />} color="white" size="xs" />}
      </Stack>
      <Stack
        customStyle={`rounded-full w-${dotSizes.last} h-${dotSizes.last} ${dotColor} opacity-50`}
      />
    </Stack>
  );
};

export default IndicatorDots;
