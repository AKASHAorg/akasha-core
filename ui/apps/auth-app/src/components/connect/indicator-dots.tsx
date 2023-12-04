import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import {
  CheckIcon,
  ExclamationTriangleIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

export type TIndicatorDotsProps = {
  isSuccess?: boolean;
  hasErrors?: boolean;
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

const IndicatorDots: React.FC<TIndicatorDotsProps> = props => {
  const { isSuccess, hasErrors = false } = props;

  const dotColor = React.useMemo(() => getDotColor(isSuccess, hasErrors), [isSuccess, hasErrors]);

  return (
    <Stack direction="row" align="center" justify="center" customStyle="mx-4">
      <Stack customStyle={`rounded-full w-4 h-4 ${dotColor} opacity-50`} />
      <Stack
        direction="row"
        align="center"
        justify="center"
        customStyle={`rounded-full w-5 h-5 ${dotColor} mx-2`}
      >
        {isSuccess && <Icon icon={<CheckIcon />} color="white" size="xs" />}
        {hasErrors && <Icon icon={<ExclamationTriangleIcon />} color="white" size="xs" />}
      </Stack>
      <Stack customStyle={`rounded-full w-4 h-4 ${dotColor} opacity-50`} />
    </Stack>
  );
};

export default IndicatorDots;
