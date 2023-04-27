import React from 'react';
import { tw } from '@twind/core';

import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import PageButtons, { IPageButtonsProps } from '../dashboard/page-buttons';

export interface IBecomeModeratorProps extends IPageButtonsProps {
  assetName?: string;
  publicImgPath?: string;
  titleLabel: string;
  subtitle1Label: string;
  codeOfConductLabel: string;
  subtitle2Label: string;
}

const BecomeModerator: React.FC<IBecomeModeratorProps> = props => {
  const {
    assetName = 'moderation',
    publicImgPath = '/images',
    titleLabel,
    subtitle1Label,
    // codeOfConductLabel,
    // subtitle2Label,
  } = props;

  return (
    <BasicCardBox pad="p-4">
      <Box customStyle="grid gap-4 grid-cols-1">
        <Text variant="h5" align="center">
          {titleLabel}
        </Text>

        <Box customStyle="w-40 h-40 my-2 mx-auto">
          <img
            className={tw('object-contain')}
            aria-label={assetName}
            src={`${publicImgPath}/${assetName}.webp`}
            alt={assetName}
            data-testid={`${assetName}-image`}
          />
        </Box>

        <Text align="center">{subtitle1Label}</Text>

        <Box customStyle="flex space-x-6 items-center justify-end">
          <PageButtons {...props} />
        </Box>
      </Box>
    </BasicCardBox>
  );
};

export default BecomeModerator;
