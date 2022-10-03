import React from 'react';

import DS from '@akashaorg/design-system';

const { Box, Button, LinkInput, Text, TextArea, styled } = DS;

interface IStepThreeProps {
  ctaIntroLabel: string[];
  messageNameTitleLabel: string;
  messageNameValue: string;
  messageNameInputPlaceholder: string;
  messageTitleLabel: string;
  messageValue: string;
  messageInputPlaceholder: string;
  validationStatus: { isError: boolean; errorMessage?: string };
  isFetching: boolean;
  buttonLabel: string;
  onCTAClick: () => void;
  onMessageNameInputChange: (ev) => void;
  onMessageInputChange: (ev) => void;
  onButtonClick: () => void;
}

const StyledTextArea = styled(TextArea)`
  border: none;
`;

const StepThree: React.FC<IStepThreeProps> = props => {
  const {
    ctaIntroLabel,
    messageNameTitleLabel,
    messageTitleLabel,
    messageNameValue,
    messageValue,
    messageNameInputPlaceholder,
    messageInputPlaceholder,
    validationStatus,
    isFetching,
    buttonLabel,
    onCTAClick,
    onMessageNameInputChange,
    onMessageInputChange,
    onButtonClick,
  } = props;
  return (
    <Box gap="xsmall">
      <Text size="large" margin={{ top: 'xsmall' }}>
        {ctaIntroLabel[0]}{' '}
        <Text size="large" color="accentText" style={{ cursor: 'pointer' }} onClick={onCTAClick}>
          {ctaIntroLabel[1]}{' '}
        </Text>
        {ctaIntroLabel[2]}
      </Text>
      <Text
        size="large"
        weight="bold"
        margin={{ top: 'xsmall' }}
        style={{ textTransform: 'uppercase' }}
      >
        {messageNameTitleLabel}
      </Text>
      <LinkInput
        inputPlaceholder={messageNameInputPlaceholder}
        inputValue={messageNameValue || ''}
        elevation="shadow"
        margin="0rem"
        noArrowRight={true}
        onChange={onMessageNameInputChange}
      />
      <Text
        size="large"
        weight="bold"
        margin={{ top: 'xsmall' }}
        style={{ textTransform: 'uppercase' }}
      >
        {messageTitleLabel}
      </Text>
      <Box
        fill="horizontal"
        pad={{ vertical: 'xsmall', horizontal: 'small' }}
        round="xxsmall"
        elevation="shadow"
        border={{
          side: 'all',
          color:
            (!!messageValue.length && 'accent') ||
            (validationStatus.isError && 'errorText') ||
            'border',
        }}
      >
        <StyledTextArea
          resize={false}
          size="large"
          rows={8}
          style={{ padding: 0 }}
          value={messageValue}
          onChange={onMessageInputChange}
          placeholder={messageInputPlaceholder}
        />
      </Box>
      {validationStatus.isError && (
        <Text size="small" color="errorText">
          {validationStatus.errorMessage}
        </Text>
      )}

      <Box direction="row" justify="end" gap="small" margin={{ top: 'medium' }}>
        <Button
          primary={true}
          disabled={!messageValue.length}
          label={isFetching ? '...' : buttonLabel}
          onClick={onButtonClick}
        />
      </Box>
    </Box>
  );
};

export default StepThree;
