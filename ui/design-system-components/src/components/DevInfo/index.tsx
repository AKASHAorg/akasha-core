import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import AppList, { AppListProp } from '../AppList';
import { Developer } from '../types/common.types';

export type DevInfoProps = {
  developerTitle: string;
  developers: Developer[];
  apps: AppListProp['apps'];
  onAppSelected: (appId: string) => void;
};

const DevInfo: React.FC<DevInfoProps> = ({ developerTitle, developers, apps, onAppSelected }) => {
  return (
    <Card elevation="1" padding={16} radius={20}>
      <Stack direction="column" spacing="gap-y-2">
        <Text variant="h5">{developerTitle}</Text>
        {developers.map(developer => (
          <Stack key={developer.profileId} direction="column" spacing="gap-y-2">
            <ProfileAvatarButton {...developer} />
            <Divider />
            <AppList apps={apps} onAppSelected={onAppSelected} />
          </Stack>
        ))}
      </Stack>
    </Card>
  );
};

export default DevInfo;
