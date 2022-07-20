import React from 'react';

import DS from '@akashaorg/design-system';

import { BaseStepsProps } from './step-one';
import { tokenDetails } from './onboarding-steps';

const { Box, Button, Icon, Text } = DS;

interface IStepFourProps extends BaseStepsProps {
  tokenDetails: tokenDetails;
  tokenUnUsedLabel: string;
  tokenUsedLabel: string;
  expiresInlabel: string;
  paragraphLabel: string;
  buttonLabel: string[];
  onCopyClick: () => void;
  onButtonClick: () => void;
}

const StepFour: React.FC<IStepFourProps> = props => {
  const {
    titleLabel,
    tokenDetails,
    tokenUnUsedLabel,
    tokenUsedLabel,
    expiresInlabel,
    paragraphLabel,
    buttonLabel,
    onCopyClick,
    onButtonClick,
  } = props;
  return (
    <Box>
      {titleLabel && (
        <Text size="large" margin={{ bottom: 'xsmall' }} weight="bold">
          {titleLabel}
        </Text>
      )}
      <Box round="0.5rem" border={{ color: 'border' }} pad="medium" gap="small">
        <Text size="large" margin={{ vertical: 'xsmall' }}>
          {tokenDetails.name}
        </Text>
        <Box direction="row" gap="small">
          <Box direction="row" gap="small" align="center">
            <Box
              width="0.5rem"
              height="0.5rem"
              round={true}
              background={tokenDetails.isUsed ? 'green' : 'yellow'}
            />
            <Text size="large">{tokenDetails.isUsed ? tokenUsedLabel : tokenUnUsedLabel}</Text>
          </Box>
          <Box direction="row" gap="xxsmall" align="center">
            <Text size="large" color="accentText">
              {expiresInlabel}
            </Text>
            <Text size="large" color="accentText">
              {tokenDetails.expiresAt}
            </Text>
          </Box>
        </Box>
        <Box direction="row" gap="small" margin={{ vertical: 'xsmall' }}>
          <Text size="large" color="secondaryText">
            {tokenDetails.token}
          </Text>
          <Icon
            type="copy"
            color="secondaryText"
            style={{ cursor: 'pointer' }}
            onClick={onCopyClick}
          />
        </Box>
      </Box>
      <Text size="large" margin={{ vertical: 'large' }}>
        {paragraphLabel}
      </Text>
      <Box direction="row" justify="end" gap="small" margin={{ top: 'medium' }}>
        <Button primary={true} label={buttonLabel} onClick={onButtonClick} />
      </Box>
    </Box>
  );
};

export default StepFour;
