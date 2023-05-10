import React from 'react';
import { tw } from '@twind/core';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import SteppedActionWrapper, { ISteppedActionWrapperProps } from './stepped-action-wrapper';

export interface IBMConfirmationProps extends ISteppedActionWrapperProps {
  assetName?: string;
  publicImgPath?: string;
  titleLabel: string;
  subtitle1Label: string;
  hereLabel: string;
  subtitle2Label: string;
  overviewPageLabel: string;
  subtitle3Label: string;
  onCTAClick?: () => void;
}

const BMConfirmation: React.FC<IBMConfirmationProps> = props => {
  const {
    assetName = 'moderation',
    publicImgPath = '/images',
    subtitle1Label,
    hereLabel,
    subtitle2Label,
    overviewPageLabel,
    subtitle3Label,
    onCTAClick,
  } = props;

  return (
    <SteppedActionWrapper {...props}>
      <Box customStyle="w-40 h-40 my-2 mx-auto">
        <img
          className={tw('object-contain')}
          aria-label={assetName}
          src={`${publicImgPath}/${assetName}.webp`}
          alt={assetName}
          data-testid={`${assetName}-image`}
        />
      </Box>

      <Text align="center">
        {subtitle1Label}{' '}
        {hereLabel && (
          <Button plain={true} onClick={onCTAClick}>
            <Text
              as="span"
              variant="subtitle2"
              color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
              weight="bold"
              align="center"
              customStyle="cursor-pointer"
            >
              {hereLabel}
            </Text>
          </Button>
        )}{' '}
        {subtitle2Label}
        {overviewPageLabel && (
          <Button plain={true} onClick={props.onConfirmButtonClick}>
            <Text
              as="span"
              variant="subtitle2"
              color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
              weight="bold"
              align="center"
              customStyle="cursor-pointer"
            >
              {overviewPageLabel}
            </Text>
          </Button>
        )}{' '}
        {subtitle3Label}
      </Text>
    </SteppedActionWrapper>
  );
};

export default BMConfirmation;
