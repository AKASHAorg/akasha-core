import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ExclamationTriangleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

export interface IndicatorDotsProps {
  hasErrors?: boolean;
}

const getDotColor = (hasErrors: boolean) => {
  if (hasErrors) {
    return 'bg(errorLight dark:errorDark)';
  }

  return 'bg(blue-400 dark:blue-200)';
};

const IndicatorDots: React.FC<IndicatorDotsProps> = props => {
  const { hasErrors = false } = props;

  const dotColor = React.useMemo(() => getDotColor(hasErrors), [hasErrors]);

  return (
    <Stack direction="row" align="center" justify="center" customStyle="mx-4">
      <Stack customStyle={`rounded-full w-4 h-4 ${dotColor} opacity-50`} />
      <Stack
        direction="row"
        align="center"
        justify="center"
        customStyle={`rounded-full w-5 h-5 ${dotColor} mx-2`}
      >
        {hasErrors && <Icon icon={<ExclamationTriangleIcon />} color="white" size="xs" />}
      </Stack>
      <Stack customStyle={`rounded-full w-4 h-4 ${dotColor} opacity-50`} />
    </Stack>
  );
};

export default IndicatorDots;
