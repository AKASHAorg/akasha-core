import React from 'react';

import DS from '@akashaorg/design-system';

import { BaseStepsProps } from './step-one';
import { devKey } from './onboarding-steps';

const { Box, Button, Icon, Text, Image } = DS;

interface IStepFourProps extends BaseStepsProps {
  assetName?: string;
  publicImgPath?: string;
  firstKey: devKey;
  usedLabel: string;
  unusedLabel: string;
  pendingConfirmationLabel?: string;
  devPubKeyLabel: string;
  dateAddedLabel: string;
  paragraphLabel: string;
  buttonLabel: string[];
  onCopyClick: (value: string) => () => void;
  onButtonClick: () => void;
}

const StepFour: React.FC<IStepFourProps> = props => {
  const {
    assetName = 'key',
    publicImgPath = '/images',
    titleLabel,
    firstKey,
    unusedLabel,
    usedLabel,
    pendingConfirmationLabel,
    devPubKeyLabel,
    dateAddedLabel,
    paragraphLabel,
    buttonLabel,
    onCopyClick,
    onButtonClick,
  } = props;
  return (
    <Box gap="small">
      <Box height="13rem" width="16rem" margin={{ vertical: 'medium' }} alignSelf="center">
        <Image fit="contain" src={`${publicImgPath}/${assetName}.png`} />
      </Box>
      {titleLabel && (
        <Text size="large" weight="bold" textAlign="center">
          {titleLabel}
        </Text>
      )}
      <Text size="large" textAlign="center">
        {paragraphLabel}
      </Text>
      <Box
        round="0.5rem"
        gap="small"
        border={{ color: 'border' }}
        pad={{ vertical: 'xxsmall', horizontal: 'xsmall' }}
      >
        <Box direction="row" gap="xxsmall" align="center">
          <Text size="large" weight="bold">
            {firstKey.name}
          </Text>
          <Box
            width="0.5rem"
            height="0.5rem"
            round={true}
            background={firstKey.usedAt ? 'green' : 'yellow'}
          />

          {pendingConfirmationLabel && <Text size="large">{pendingConfirmationLabel}</Text>}

          {!pendingConfirmationLabel && (
            <Text size="large">{firstKey.usedAt ? usedLabel : unusedLabel}</Text>
          )}
        </Box>
        <Box>
          <Text size="medium" weight="bold" style={{ textTransform: 'uppercase' }}>
            {devPubKeyLabel}
          </Text>
          <Box direction="row" gap="small">
            <Text size="large" color="secondaryText">
              {firstKey.pubKey}
            </Text>
            <Icon
              type="copy"
              color="secondaryText"
              style={{ cursor: 'pointer' }}
              onClick={onCopyClick(firstKey.pubKey)}
            />
          </Box>
        </Box>
        <Box>
          <Text size="medium" weight="bold" style={{ textTransform: 'uppercase' }}>
            {dateAddedLabel}
          </Text>
          <Box direction="row" gap="small">
            <Text size="large" color="secondaryText">
              {firstKey.addedAt}
            </Text>
          </Box>
        </Box>
      </Box>

      <Box direction="row" justify="end" gap="small">
        <Button primary={true} label={buttonLabel} onClick={onButtonClick} />
      </Box>
    </Box>
  );
};

export default StepFour;
