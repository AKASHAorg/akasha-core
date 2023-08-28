import React from 'react';

import { Developer } from '@akashaorg/typings/ui';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import AppList, { AppListProps } from '../AppList';

export type DevInfoProps = {
  developerTitle: string;
  developers: Developer[];
  apps: AppListProps['apps'];
  onAppSelected: (appId: string) => void;
};

const DevInfo: React.FC<DevInfoProps> = ({ developerTitle, developers, apps, onAppSelected }) => {
  return (
    <Card elevation="1" padding={'p-4'} radius={20}>
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
