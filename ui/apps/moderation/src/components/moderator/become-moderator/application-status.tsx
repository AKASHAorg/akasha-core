import React from 'react';
import { tw } from '@twind/core';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import {
  IPageHeaderProps,
  ISubtitleRendererProps,
  PageHeader,
  SubtitleRenderer,
} from '../../common';

export interface IApplicationStatusProps extends IPageHeaderProps {
  assetName?: string;
  publicImgPath?: string;
  titleLabel: string;
}

const ApplicationStatus: React.FC<IApplicationStatusProps & ISubtitleRendererProps> = props => {
  const { assetName = 'moderation', publicImgPath = '/images', titleLabel } = props;

  return (
    <PageHeader {...props}>
      <Box customStyle="flex flex-col space-y-4">
        <Box customStyle="w-40 h-40 my-2 mx-auto">
          <img
            className={tw('object-contain')}
            aria-label={assetName}
            src={`${publicImgPath}/${assetName}.webp`}
            alt={assetName}
            data-testid={`${assetName}-image`}
          />
        </Box>

        <Text variant="h5" align="center">
          {titleLabel}
        </Text>

        <SubtitleRenderer {...props} />
      </Box>
    </PageHeader>
  );
};

export default ApplicationStatus;
