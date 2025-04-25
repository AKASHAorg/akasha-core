import React, { useMemo } from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
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
    return 'bg-success dark:bg-success';
  }

  if (error) {
    return 'bg-errorLight dark:bg-errorDark';
  }

  return 'bg-secondaryLight dark:bg-secondaryDark';
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
    <Stack direction="row" alignItems="center" justifyContent="center" className="mx-4">
      <Stack
        className={`rounded-full w-${dotSizes.first} h-${dotSizes.first} ${dotColor} opacity-50`}
      />
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        className={`rounded-full w-${dotSizes.middle} h-${dotSizes.middle} ${dotColor} mx-2`}
      >
        {isSuccess && <Icon icon={<CheckIcon />} size="xs" customStyle={'[&>*]:stroke-white'} />}
        {hasErrors && (
          <Icon icon={<ExclamationTriangleIcon />} size="xs" customStyle={'[&>*]:stroke-white'} />
        )}
      </Stack>
      <Stack
        className={`rounded-full w-${dotSizes.last} h-${dotSizes.last} ${dotColor} opacity-50`}
      />
    </Stack>
  );
};

export default IndicatorDots;
