import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import ProfileStatLoading from './profile-stat-loading';
import ProfileHeaderLoading from './profile-header-loading';

const ProfileLoading: React.FC = () => {
  return (
    <Stack spacing="gap-y-4">
      <ProfileHeaderLoading />
      <Card elevation="1" radius={20} padding={'p-4'}>
        <Stack spacing="gap-2">
          <TextLine width="w-24" animated />
          <Stack spacing="gap-1">
            <TextLine width="w-full" animated />
            <TextLine width="w-full" animated />
            <TextLine width="w-full" animated />
          </Stack>
        </Stack>
      </Card>
      <ProfileStatLoading />
      <Card elevation="1" radius={20} padding={'p-4'}>
        <Stack spacing="gap-2">
          <TextLine width="w-24" animated />
          <TextLine width="w-full" animated />
        </Stack>
      </Card>
    </Stack>
  );
};

export default ProfileLoading;
