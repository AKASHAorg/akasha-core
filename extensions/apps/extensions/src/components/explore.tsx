import React from 'react';
import AppList, { App } from '@akashaorg/design-system-components/lib/components/AppList';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

type TLatestExtensionsCardProps = {
  buttonLabel: string;
  latestExtensionsLabel: string;
  latestExtensions?: App[];
  onViewAllClick: () => void;
};

export type TExploreProps = TLatestExtensionsCardProps & {
  titleLabel: string;
  publicImgPath?: string;
  assetExtension?: string;
  sections: {
    assetName?: string;
    title: string;
    description: string;
    ctaNode: React.ReactNode;
  }[];
};

export const Explore: React.FC<TExploreProps> = props => {
  const {
    titleLabel,
    publicImgPath = '/images',
    assetExtension = 'webp',
    sections,
    latestExtensionsLabel,
    latestExtensions,
    buttonLabel,
    onViewAllClick,
  } = props;

  return (
    <Stack spacing="gap-y-4" customStyle="mb-2">
      <Text variant="h5">{titleLabel}</Text>
      {sections.map((section, idx) => (
        <React.Fragment key={section.title + idx}>
          {!!latestExtensions?.length && idx === 1 && (
            <Card padding="p-4">
              <Stack spacing="gap-y-4">
                <Stack direction="row" align="center" justify="between">
                  <Text variant="h6">{latestExtensionsLabel}</Text>
                  <Button variant="text" label={buttonLabel} onClick={onViewAllClick} />
                </Stack>
                <AppList
                  apps={latestExtensions}
                  onLoadMore={() => {
                    return new Promise(null);
                  }}
                />
              </Stack>
            </Card>
          )}
          <Card key={section.title + idx} padding="p-4">
            <Stack spacing="gap-y-3">
              {section.assetName && (
                <Image
                  customStyle="object-contain rounded-2xl"
                  src={`${publicImgPath}/${section.assetName}.${assetExtension}`}
                />
              )}
              <Text variant="h6">{section.title}</Text>
              <Text variant="body2">{section.description}</Text>
              {section.ctaNode}
            </Stack>
          </Card>
        </React.Fragment>
      ))}
    </Stack>
  );
};
