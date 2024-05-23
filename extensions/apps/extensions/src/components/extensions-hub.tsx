import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type TExtensionsHubProps = {
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

export const ExtensionsHub: React.FC<TExtensionsHubProps> = props => {
  const { titleLabel, publicImgPath = '/images', assetExtension = 'webp', sections } = props;

  return (
    <Stack spacing="gap-y-4">
      <Text variant="h5">{titleLabel}</Text>
      {sections.map((section, idx) => (
        <Card key={section.title + idx} padding="p-4">
          <Stack spacing="gap-y-3">
            <Text variant="h6">{section.title}</Text>
            {section.assetName && (
              <Stack alignSelf="center" customStyle="h-52 w-52">
                <Image
                  customStyle="object-contain"
                  src={`${publicImgPath}/${section.assetName}.${assetExtension}`}
                />
              </Stack>
            )}
            <Text variant="body2">{section.description}</Text>
            {section.ctaNode}
          </Stack>
        </Card>
      ))}
    </Stack>
  );
};
