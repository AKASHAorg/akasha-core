import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Tab from '@akashaorg/design-system-core/lib/components/Tab';
import ListEntryLoading from './EntryLoading';
import { LOADING_LIST_SIZE } from '../Engagement';

export const ProfileEngagementLoading = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  return (
    <Card radius={20} elevation="1" customStyle="py-4">
      <Tab value={activeTab} onChange={setActiveTab} labels={['...', '...']}>
        <Stack direction="column" spacing="gap-y-4">
          {Array.from({ length: LOADING_LIST_SIZE }).map((_, index) => (
            <ListEntryLoading key={`${index}`} />
          ))}
        </Stack>
        <Stack direction="column" spacing="gap-y-4">
          {Array.from({ length: LOADING_LIST_SIZE }).map((_, index) => (
            <ListEntryLoading key={`${index + LOADING_LIST_SIZE}`} />
          ))}
        </Stack>
      </Tab>
    </Card>
  );
};
