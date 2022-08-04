import React from 'react';
import DS from '@akashaorg/design-system';

const { Box, Button, Text, MainAreaCardBox, Icon } = DS;

export interface IStepTwoProps {
  titleLabel: string;
  textLine1Label: string;
  skipLabel: string;
  nextLabel: string;
  onClickIcon: () => void;
  onClickSkip: () => void;
  onClickNext: () => void;
}

const StepTwo: React.FC<IStepTwoProps> = props => {
  const {
    titleLabel,
    textLine1Label,
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
        <Text size="large" margin={{ bottom: 'xsmall' }}>
          {textLine1Label}
        </Text>
        <Box direction="row" fill="horizontal" justify="end" align="center" gap="small">
          <Button size="large" height={2.5} label={skipLabel} onClick={onClickSkip} />
          <Button
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

export default StepTwo;
