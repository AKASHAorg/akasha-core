import React from 'react';

import DS from '@akashaorg/design-system';

const { Box, Button, LinkInput, Text } = DS;

interface IStepThreeProps {
  ctaIntroLabel: string[];
  messageInputLabel: string;
  messageInputValue: string;
  messageInputPlaceholder: string;
  tokenNameInputLabel: string;
  tokenNameInputValue: string;
  tokenNameInputPlaceholder: string;
  buttonLabel: string;
  onCTAClick: () => void;
  onmessageInputChange: (ev) => void;
  ontokenNameInputChange: (ev) => void;
  onButtonClick: () => void;
}

const StepThree: React.FC<IStepThreeProps> = props => {
  const {
    ctaIntroLabel,
    messageInputLabel,
    tokenNameInputLabel,
    messageInputValue,
    tokenNameInputValue,
    messageInputPlaceholder,
    tokenNameInputPlaceholder,
    buttonLabel,
    onCTAClick,
    onmessageInputChange,
    ontokenNameInputChange,
    onButtonClick,
  } = props;
  return (
    <Box>
      <Text size="large" margin={{ bottom: 'xsmall' }}>
        {ctaIntroLabel[0]}{' '}
        <Text size="large" color="accentText" style={{ cursor: 'pointer' }} onClick={onCTAClick}>
          {ctaIntroLabel[1]}{' '}
        </Text>
        {ctaIntroLabel[2]}
      </Text>
      <Text size="large" margin={{ top: 'large' }}>
        {messageInputLabel}
      </Text>
      <LinkInput
        inputPlaceholder={messageInputPlaceholder}
        inputValue={messageInputValue || ''}
        elevation="shadow"
        margin={{ left: '0rem', top: 'large', bottom: 'small' }}
        noArrowRight={true}
        onChange={onmessageInputChange}
      />
      <Text size="large" margin={{ top: 'large' }}>
        {tokenNameInputLabel}
      </Text>
      <LinkInput
        inputPlaceholder={tokenNameInputPlaceholder}
        inputValue={tokenNameInputValue || ''}
        elevation="shadow"
        margin={{ left: '0rem', top: 'large', bottom: 'small' }}
        noArrowRight={true}
        onChange={ontokenNameInputChange}
      />

      <Box direction="row" justify="end" gap="small" margin={{ top: 'medium' }}>
        <Button
          primary={true}
          disabled={!messageInputValue.length}
          label={buttonLabel}
          onClick={onButtonClick}
        />
      </Box>
    </Box>
  );
};

export default StepThree;
