import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TrendingWidgetLoadingCard from '../TrendingWidgetLoadingCard';

const TrendingWidgetLoader: React.FC = () => {
  return (
    <Stack direction="column" spacing="gap-y-3" align="center">
      {Array.from({ length: 2 }, (_el, index: number) => (
        <TrendingWidgetLoadingCard key={index} />
      ))}
    </Stack>
  );
};

export default TrendingWidgetLoader;
