import React from 'react';
import Card from '../Card';
import FollowEntryLoading from '../ProfileCard/placeholders/FollowEntryLoading';
import Stack from '../Stack';
import Tab from '../Tab';
import { LOADING_LIST_SIZE } from './StatList';

export const ProfileStatLoading = () => {
  return (
    <Card radius={20} elevation="1" customStyle="py-4">
      <Tab labels={['...', '...']}>
        <Stack direction="column">
          {Array.from({ length: LOADING_LIST_SIZE }).map((_, index) => (
            <FollowEntryLoading key={index} />
          ))}
        </Stack>
        <Stack direction="column">
          {Array.from({ length: LOADING_LIST_SIZE }).map((_, index) => (
            <FollowEntryLoading key={index} />
          ))}
        </Stack>
      </Tab>
    </Card>
  );
};
