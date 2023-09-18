import React from 'react';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import { PageHeaderProps, SubtitleRendererProps, PageHeader, SubtitleRenderer } from '../../common';

export type ApplicationStatusProps = PageHeaderProps &
  SubtitleRendererProps & {
    assetName?: string;
    publicImgPath?: string;
    assetExtension?: string;
    titleLabel: string;
  };

const ApplicationStatus: React.FC<ApplicationStatusProps> = props => {
  const {
    assetName = 'vibe-overview',
    publicImgPath = '/images',
    assetExtension = 'webp',
    titleLabel,
  } = props;

  return (
    <PageHeader {...props}>
      <Stack spacing="gap-y-4">
        <Stack customStyle="w-40 h-40 my-2 mx-auto">
          <Image
            src={`${publicImgPath}/${assetName}.${assetExtension}`}
            dataTestId={`${assetName}-image`}
          />
        </Stack>

        <Text variant="h5" align="center">
          {titleLabel}
        </Text>

        <SubtitleRenderer {...props} />
      </Stack>
    </PageHeader>
  );
};

export default ApplicationStatus;
