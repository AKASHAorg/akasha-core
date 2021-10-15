import React from 'react';
import { Box, FormField, Text } from 'grommet';

import Icon from '../../Icon';
import { IFormValues } from '../';

import { StyledText, StyledTextInput } from '../styled-form-card';

export interface IUsernameInputSectionProps {
  usernameLabel?: string;
  usernameFieldInfo?: string;
  usernameFieldPlaceholder?: string;
  isValidatingUsername?: boolean;
  usernameError?: string;
  usernameSuccess?: string;
  formValues: IFormValues;
  handleUsernameChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  handleUsernameBlur: (ev: React.FocusEvent<HTMLInputElement>) => void;
}

const UsernameInputSection: React.FC<IUsernameInputSectionProps> = props => {
  const {
    usernameLabel,
    usernameFieldInfo,
    usernameFieldPlaceholder,
    isValidatingUsername,
    usernameError,
    usernameSuccess,
    formValues,
    handleUsernameChange,
    handleUsernameBlur,
  } = props;

  const renderIcon = () => {
    if (isValidatingUsername) {
      return <Icon type="loading" />;
    }
    if (usernameError) {
      return <Icon type="error" />;
    }
    if (usernameSuccess) {
      return <Icon type="check" accentColor={true} />;
    }
    return;
  };

  return (
    <Box pad={{ top: 'small' }} justify="start" fill="horizontal">
      <Box direction="row" align="center">
        <StyledText
          size="small"
          margin={{ bottom: '0.5em', left: '0' }}
          color="secondaryText"
          style={{ userSelect: 'none' }}
        >
          {usernameLabel} <Text color="accent">*</Text>
        </StyledText>
      </Box>
      <FormField
        name="name"
        width="100%"
        htmlFor="username-input"
        info={
          usernameError ? (
            <Text color="errorText" style={{ fontSize: '0.75em' }}>
              {usernameError}
            </Text>
          ) : (
            <Text color="secondaryText" style={{ fontSize: '0.6em' }}>
              {usernameFieldInfo}
            </Text>
          )
        }
      >
        <Box justify="between" direction="row" fill="horizontal">
          <Box fill="horizontal" direction="row" align="center">
            {'@'}
            <StyledTextInput
              spellCheck={false}
              computedWidth="100%"
              id="username-input"
              maxLength={32}
              required={true}
              value={formValues.userName}
              onChange={handleUsernameChange}
              placeholder={usernameFieldPlaceholder}
              onBlur={handleUsernameBlur}
            />
          </Box>
          {renderIcon()}
        </Box>
      </FormField>
    </Box>
  );
};

export { UsernameInputSection };
