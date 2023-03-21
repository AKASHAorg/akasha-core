import React from 'react';
import Card from '../../Card';
import Stack from '../../Stack';
import Tab from '../../Tab';
import ListEntryLoading from './ListEntryLoading';
import { LOADING_LIST_SIZE } from '../StatList';

export const ProfileStatLoading = () => {
  return (
    <Card radius={20} elevation="1" customStyle="py-4">
      <Tab labels={['...', '...']}>
        <Stack direction="column" spacing="gap-y-4">
          {Array.from({ length: LOADING_LIST_SIZE }).map((_, index) => (
            <ListEntryLoading key={`stat-1-loading-${index}`} />
          ))}
        </Stack>
        <Stack direction="column" spacing="gap-y-4">
          {Array.from({ length: LOADING_LIST_SIZE }).map((_, index) => (
            <ListEntryLoading key={`stat-2-loading-${index}`} />
          ))}
        </Stack>
      </Tab>
    </Card>
  );
};
