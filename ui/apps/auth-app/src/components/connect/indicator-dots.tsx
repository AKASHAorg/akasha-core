import React from 'react';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';

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
    <Box customStyle="flex flex-row items-center justify-center mx-4">
      <Box customStyle={`rounded-full w-4 h-4 ${dotColor} opacity-50`} />
      <Box
        customStyle={`flex flex-row rounded-full w-5 h-5 ${dotColor} mx-2 justify-center items-center`}
      >
        {hasErrors && <Icon type="ExclamationTriangleIcon" color="white" size="xs" />}
      </Box>
      <Box customStyle={`rounded-full w-4 h-4 ${dotColor} opacity-50`} />
    </Box>
  );
};

export default IndicatorDots;
