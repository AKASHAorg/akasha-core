import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import ProfileStatLoading from './profile-stat-loading';
import ProfileHeaderLoading from './profile-header-loading';

const ProfileLoading: React.FC = () => {
  return (
    <Stack spacing={4}>
      <ProfileHeaderLoading />
      <Card className="p-4">
        <Stack spacing={2}>
          <TextLine width="w-24" animated />
          <Stack spacing={1}>
            <TextLine width="w-full" animated />
            <TextLine width="w-full" animated />
          </Stack>
        </Stack>
      </Card>
      <ProfileStatLoading />
      <Card className="p-4">
        <Stack spacing={2}>
          <TextLine width="w-24" animated />
          <TextLine width="w-full" animated />
        </Stack>
      </Card>
    </Stack>
  );
};

export default ProfileLoading;
