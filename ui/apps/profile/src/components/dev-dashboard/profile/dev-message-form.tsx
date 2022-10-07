import React from 'react';

import DS from '@akashaorg/design-system';

const { Box, Button, Text, TextArea, LinkInput, styled } = DS;

export interface IDevMessageFormProps {
  messageNameTitleLabel: string;
  messageNameValue: string;
  messageNameInputPlaceholder: string;
  messageTitleLabel: string;
  messageValue: string;
  messageInputPlaceholder: string;
  validationStatus: { isError: boolean; errorMessage?: string };
  isFetching: boolean;
  buttonLabel: string;
  onMessageNameInputChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  onMessageInputChange: (ev: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onButtonClick: () => void;
}

const StyledTextArea = styled(TextArea)`
  border: none;
`;

const DevMessageForm: React.FC<IDevMessageFormProps> = props => {
  const {
    messageNameTitleLabel,
    messageTitleLabel,
    messageNameValue,
    messageValue,
    messageNameInputPlaceholder,
    messageInputPlaceholder,
    validationStatus,
    isFetching,
    buttonLabel,
    onMessageNameInputChange,
    onMessageInputChange,
    onButtonClick,
  } = props;

  return (
    <Box gap="large" margin={{ top: 'medium' }}>
      <Box gap="xsmall">
        <Text size="medium" weight="bold" style={{ textTransform: 'uppercase' }}>
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
      </Box>
      <Box gap="xsmall">
        <Text size="medium" weight="bold" style={{ textTransform: 'uppercase' }}>
          {messageTitleLabel}
        </Text>
        <Box
          fill="horizontal"
          pad={{ vertical: 'xsmall', horizontal: 'small' }}
          round="xxsmall"
          elevation="shadow"
          border={{
            side: 'all',
            color: validationStatus.isError
              ? 'errorText'
              : messageValue.length
              ? 'accent'
              : 'border',
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
      </Box>

      <Box direction="row" justify="end" gap="small">
        <Button
          primary={true}
          disabled={isFetching || !messageValue.length}
          label={isFetching ? '...' : buttonLabel}
          onClick={onButtonClick}
        />
      </Box>
    </Box>
  );
};

export default DevMessageForm;
