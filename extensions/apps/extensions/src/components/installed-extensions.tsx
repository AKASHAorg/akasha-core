import React from 'react';
import AppList, { App } from '@akashaorg/design-system-components/lib/components/AppList';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type InstalledExtensionsProps = {
  titleLabel: string;
  publicImgPath?: string;
  assetExtension?: string;
  installedExtensions: App[];
  defaultExtensions: App[];
  sections: {
    assetName?: string;
    title: string;
    discoverLabel?: string;
    description: string;
    description2?: string;
    onClickDiscover?: () => void;
  }[];
};

export const InstalledExtensions: React.FC<InstalledExtensionsProps> = props => {
  const {
    titleLabel,
    publicImgPath = '/images',
    assetExtension = 'webp',
    installedExtensions,
    defaultExtensions,
    sections,
  } = props;

  return (
    <Stack spacing="gap-y-4">
      <Text variant="h5">{titleLabel}</Text>
      <Card padding="p-4">
        <Stack spacing="gap-y-3" align="center">
          {!installedExtensions.length && (
            <>
              <Stack customStyle="h-52 w-52">
                <Image
                  customStyle="object-contain"
                  src={`${publicImgPath}/${sections[0].assetName}.${assetExtension}`}
                />
              </Stack>
              <Text variant="h6">{sections[0].title}</Text>
              <Stack align="center">
                <Text as="span" color={{ light: 'grey5', dark: 'grey6' }}>
                  <Button
                    variant="text"
                    size="md"
                    label={sections[0].discoverLabel}
                    onClick={sections[0].onClickDiscover}
                  />{' '}
                  {sections[0].description}
                </Text>
                <Text variant="body2" color={{ light: 'grey5', dark: 'grey6' }}>
                  {sections[0].description2}
                </Text>
              </Stack>
            </>
          )}
          {!!installedExtensions.length && (
            <AppList
              apps={installedExtensions}
              onLoadMore={() => {
                return new Promise(null);
              }}
            />
          )}
        </Stack>
      </Card>
      <Card padding="p-4" margin="mb-2">
        <Stack spacing="gap-y-3">
          <Text variant="h6">{sections[1].title}</Text>
          <Text variant="body2" color={{ light: 'grey5', dark: 'grey6' }}>
            {sections[1].description}
          </Text>
          <AppList
            apps={defaultExtensions}
            onLoadMore={() => {
              return new Promise(null);
            }}
          />
        </Stack>
      </Card>
    </Stack>
  );
};
