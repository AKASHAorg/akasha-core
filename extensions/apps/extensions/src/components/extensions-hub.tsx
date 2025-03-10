import React from 'react';
import AppList from '@akashaorg/design-system-components/lib/components/AppList';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { ExtensionCardProps } from '@akashaorg/design-system-components/lib/components/ExtensionCard';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Image } from '@akashaorg/ui/lib/akasha-components/image';
export type TExtensionsHubProps = {
  titleLabel: string;
  publicImgPath?: string;
  assetExtension?: string;
  extensions?: ExtensionCardProps[];
  sections: {
    assetName?: string;
    title: string;
    description: string;
    ctaNode: React.ReactNode;
  }[];
};

export const ExtensionsHub: React.FC<TExtensionsHubProps> = props => {
  const {
    titleLabel,
    publicImgPath = '/images',
    assetExtension = 'webp',
    extensions,
    sections,
  } = props;

  return (
    <Stack spacing={4} className="mb-2">
      <Text variant="h5">{titleLabel}</Text>
      {extensions.length > 0 && (
        <Card className="p-4">
          <AppList apps={extensions} onLoadMore={() => null} />
        </Card>
      )}
      {sections.map((section, idx) => (
        <Card key={section.title + idx} className="p-4">
          <Stack spacing={3}>
            <Text variant="h6">{section.title}</Text>
            {section.assetName && (
              <Stack className="self-center h-52 w-52">
                <Image src={`${publicImgPath}/${section.assetName}.${assetExtension}`} />
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
