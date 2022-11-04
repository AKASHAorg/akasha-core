import React from 'react';
import DS from '@akashaorg/design-system';

const { Box, Button, Text, Image, MainAreaCardBox, Icon } = DS;

export interface IStepOneProps {
  assetName?: string;
  titleLabel: string;
  publicImgPath?: string;
  textLine1Label: string;
  textLine2Label: string;
  textLine3Label: string;
  skipLabel: string;
  nextLabel: string;
  onClickIcon: () => void;
  onClickSkip: () => void;
  onClickNext: () => void;
}

const StepOne: React.FC<IStepOneProps> = props => {
  const {
    assetName = 'blocks',
    titleLabel,
    publicImgPath = '/images',
    textLine1Label,
    textLine2Label,
    textLine3Label,
    skipLabel,
    nextLabel,
    onClickIcon,
    onClickSkip,
    onClickNext,
  } = props;

  return (
    <MainAreaCardBox margin={{ bottom: '1rem' }}>
      <Box align="start" fill="horizontal" pad="medium">
        <Box direction="row" fill="horizontal" margin={{ bottom: 'medium' }}>
          <Icon type="chevronLeft" style={{ cursor: 'pointer' }} onClick={onClickIcon} />
          <Text size="xlarge" weight="bold">
            {titleLabel}
          </Text>
        </Box>
        <Box fill="horizontal">
          <Text size="large" margin={{ bottom: 'xsmall' }}>
            {textLine1Label}
          </Text>
          <Text size="large" margin={{ bottom: 'xsmall' }}>
            {textLine2Label}
          </Text>
          <Box width="12.125rem" margin={{ bottom: 'medium' }}>
            <Image fit="contain" src={`${publicImgPath}/${assetName}.png`} />
          </Box>
          <Text size="large" margin={{ bottom: 'xsmall' }}>
            {textLine3Label}
          </Text>
        </Box>
        <Box direction="row" fill="horizontal" justify="end" align="center" gap="small">
          <Button
            slimBorder={true}
            size="large"
            height={2.5}
            label={skipLabel}
            onClick={onClickSkip}
          />
          <Button
            slimBorder={true}
            size="large"
            height={2.5}
            primary={true}
            label={nextLabel}
            onClick={onClickNext}
          />
        </Box>
      </Box>
    </MainAreaCardBox>
  );
};

export default StepOne;
