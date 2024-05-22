import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type TExploreProps = {
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
  const { titleLabel, publicImgPath = '/images', assetExtension = 'webp', sections } = props;

  return (
    <Stack spacing="gap-y-4">
      <Text variant="h5">{titleLabel}</Text>
      {sections.map((section, idx) => (
        <Card key={section.title + idx} padding="p-4">
          <Stack spacing="gap-y-3">
            {section.assetName && (
              <Image
                customStyle="object-contain rounded-2xl"
                src={`${publicImgPath}/${section.assetName}.${assetExtension}`}
              />
            )}
            <Text variant="h6">{section.title}</Text>
            <Text variant="body2">
              {section.description}
              🌟🔍✨
            </Text>
            {section.ctaNode}
          </Stack>
        </Card>
      ))}
    </Stack>
  );
};
