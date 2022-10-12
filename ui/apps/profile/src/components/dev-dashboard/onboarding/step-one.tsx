import React from 'react';

import DS from '@akashaorg/design-system';

import ListItem from './list-item';

const { Box, Button, Text } = DS;

export interface BaseStepsProps {
  titleLabel?: string;
  subtitleLabel?: string;
}

interface IStepOneProps extends BaseStepsProps {
  paragraphs: string[];
  acceptLabel: string;
  rejectLabel: string;
  onRejectClick: () => void;
  onAcceptClick: () => void;
}

const StepOne: React.FC<IStepOneProps> = props => {
  const {
    titleLabel,
    subtitleLabel,
    paragraphs,
    acceptLabel,
    rejectLabel,
    onAcceptClick,
    onRejectClick,
  } = props;

  return (
    <Box>
      {titleLabel && (
        <Text size="large" margin={{ bottom: 'xsmall' }} weight="bold">
          {titleLabel}
        </Text>
      )}
      {subtitleLabel && (
        <Text size="large" margin={{ bottom: 'xsmall' }}>
          {subtitleLabel}
        </Text>
      )}
      {paragraphs.map((paragraph: string, idx: number) => (
        <ListItem key={idx} listElementText="•" item={paragraph} />
      ))}
      <Box direction="row" justify="end">
        <Button label={rejectLabel} onClick={onRejectClick} />
        <Button primary={true} label={acceptLabel} onClick={onAcceptClick} />
      </Box>
    </Box>
  );
};

export default StepOne;
