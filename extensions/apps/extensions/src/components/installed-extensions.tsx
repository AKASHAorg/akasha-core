import React from 'react';
import AppList from '@akashaorg/design-system-components/lib/components/AppList';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { TContentProps } from './explore';

export type InstalledExtensionsProps = {
  titleLabel: string;
  defaultExtensions?: TContentProps[];
  sections: {
    assetName?: string;
    title: string;
    description: string;
  }[];
  onAppClick: (appId: string) => void;
};

export const InstalledExtensions: React.FC<InstalledExtensionsProps> = props => {
  const { titleLabel, defaultExtensions, sections, onAppClick } = props;

  return (
    <Stack spacing="gap-y-4">
      <Text variant="h5">{titleLabel}</Text>
      <Card padding="p-4">
        <Stack spacing="gap-y-3">
          <Text variant="h6">{titleLabel}</Text>
          <Text variant="body2">{sections[1].description}</Text>
          <AppList apps={defaultExtensions} onAppSelected={onAppClick} />
        </Stack>
      </Card>
    </Stack>
  );
};
