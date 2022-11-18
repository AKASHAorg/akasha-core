import React from 'react';

import DS from '@akashaorg/design-system';

import ListItem from './list-item';
import { BaseStepsProps } from './step-one';

const { Box, Button, Image, Text } = DS;

interface IStepTwoProps extends BaseStepsProps {
  assetName?: string;
  publicImgPath?: string;

  ctaListItem: string[];
  paragraphs: string[];
  readyLabel: string;
  skipLabel: string;
  onCTAClick: () => void;
  onSkipClick: () => void;
  onReadyClick: () => void;
}

const StepTwo: React.FC<IStepTwoProps> = props => {
  const {
    assetName = 'cli-command',
    publicImgPath = '/images',
    titleLabel,
    subtitleLabel,
    ctaListItem,
    paragraphs,
    readyLabel,
    skipLabel,
    onCTAClick,
    onReadyClick,
    onSkipClick,
  } = props;

  return (
    <Box>
      {titleLabel && (
        <Text size="large" margin={{ bottom: 'xsmall' }} weight="bold">
          {titleLabel}
        </Text>
      )}
      {subtitleLabel && (
        <Text size="small" color="secondaryText" margin={{ bottom: 'xsmall' }}>
          {subtitleLabel}
        </Text>
      )}
      {ctaListItem && (
        <Box direction="row" margin={{ top: 'large' }}>
          <Text size="large" margin={{ right: 'xsmall' }}>
            •
          </Text>
          <Text size="large" margin={{ bottom: 'large' }}>
            {ctaListItem[0]}{' '}
            <Text
              size="large"
              color="accentText"
              style={{ cursor: 'pointer' }}
              onClick={onCTAClick}
            >
              {ctaListItem[1]}{' '}
            </Text>
            {ctaListItem[2]}
          </Text>
        </Box>
      )}
      {paragraphs.map((paragraph: string, idx: number) => (
        <React.Fragment key={idx}>
          <ListItem listElementText="•" item={paragraph} />
          {idx === 0 && (
            <Box height="3rem" margin={{ vertical: '-1rem' }}>
              <Image fit="contain" src={`${publicImgPath}/${assetName}.webp`} />
            </Box>
          )}
        </React.Fragment>
      ))}
      <Box direction="row" justify="end" gap="small">
        <Button label={skipLabel} onClick={onSkipClick} />
        <Button primary={true} label={readyLabel} onClick={onReadyClick} />
      </Box>
    </Box>
  );
};

export default StepTwo;
