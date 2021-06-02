import React from 'react';
import { Box, FormField, Text, TextInput } from 'grommet';

import { IFormValues } from '../';
import { StyledText } from '../styled-form-card';

export interface INameInputSectionProps {
  nameLabel?: string;
  nameFieldPlaceholder?: string;
  formValues: IFormValues;
  handleFormFieldChange: (arg1: { name: string }) => void;
}

const NameInputSection: React.FC<INameInputSectionProps> = props => {
  const { nameLabel, nameFieldPlaceholder, formValues, handleFormFieldChange } = props;
  return (
    <Box justify="start" fill="horizontal" flex={{ shrink: 1, grow: 1 }} margin={{ left: '0.5em' }}>
      <FormField
        name="name"
        htmlFor="form-name-input"
        contentProps={{ margin: { left: '1em' } }}
        label={
          <StyledText
            size="small"
            color="secondaryText"
            style={{ verticalAlign: 'text-top', userSelect: 'none' }}
          >
            {nameLabel} <Text color="accent">*</Text>
          </StyledText>
        }
      >
        <TextInput
          id="form-name-input"
          name="name"
          value={formValues.name}
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
            handleFormFieldChange({ name: ev.target.value })
          }
          placeholder={nameFieldPlaceholder}
          required={true}
          size="large"
          style={{
            width: '100%',
            padding: '1em 0',
          }}
        />
      </FormField>
    </Box>
  );
};

export { NameInputSection };
