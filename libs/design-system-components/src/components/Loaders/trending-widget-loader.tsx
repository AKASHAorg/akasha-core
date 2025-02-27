import React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import TrendingWidgetLoadingCard from '../TrendingWidgetLoadingCard';

/**
 * Component used to display a skeleton placeholder for the initial load
 * of trending widget
 */
const TrendingWidgetLoader: React.FC = () => {
  return (
    <Stack direction="column" spacing={3} alignItems="center">
      {Array.from({ length: 2 }, (_el, index: number) => (
        <TrendingWidgetLoadingCard key={index} />
      ))}
    </Stack>
  );
};

export default TrendingWidgetLoader;
